import { useUserCookie } from '@/hooks/useUser';
import { Socket } from "socket.io-client";
import { EventEmitter } from "events";
import { Device } from "mediasoup-client";
import { Consumer } from "mediasoup-client/lib/Consumer";
import { Producer } from "mediasoup-client/lib/Producer";
import { DtlsParameters, IceCandidate, IceParameters, Transport } from "mediasoup-client/lib/Transport";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { IUserIdentifier } from '@/types';

export class VoiceController extends EventEmitter {
    private socket: Socket;
    private channelId: number;
    private userId: number;
    private consumers: Map<string, Consumer>;
    private producers: Map<string, Producer>;
    private recvTransport: Map<number, Transport>;
    private sendTransport?: Transport;
    private device?: Device;
    private joined: boolean;

    public constructor (socket: Socket, channelId: number, userId: number) {
        super();
        this.socket = socket;
        this.channelId = channelId;
        this.userId = userId;
        this.consumers = new Map<string, Consumer>();
        this.producers = new Map<string, Producer>();
        this.recvTransport = new Map<number, Transport>();
        this.configureSocket(socket);
        this.joined = false;
    }

    private configureSocket(socket: Socket) {
        socket.on("newUser", ({userId}) => {
            this.emit("newUser", userId);
        });
    
        socket.on("establishNewSendTransport", async (userId: number) => {
            const token = this.getToken();
            await this.createRecvTransport(this.channelId, this.userId, token);
            console.log(`userId start new send transport`);
        });
    
        socket.on("userLeave", ({userId}) => {
            // Clean up transports and consumers;
            for (let consumer of this.consumers.values()) {
                if (consumer.appData.userId === userId) {
                    consumer.close();
                }
            }
    
            for (let transport of this.recvTransport.values()) {
                if (transport.appData.userId === userId) {
                    transport.close();
                    this.recvTransport.delete(userId);
                }
            }
            this.emit("userLeave", userId);
        });

        socket.on("startProduce", async (userId: number, type: keyof MediaType, kind: MediaKind) => {
            const token = this.getToken();
            await this.startReceive(type, kind, userId, token);
            this.emit("startProduce", userId, type, kind);
        });
    }
// #region method called directly
    public cleanUpSocket() {
        const token = this.getToken();
        this.socket.off("newUser");
        this.socket.off("establishNewSendTransport");
        this.socket.off("userLeave");
        this.socket.off("startProduce");
        this.socket.emit("leave", this.channelId, this.userId, token);
        for (let producer of this.producers.values()) {
            producer.close();
        }
    
        for (let consumer of this.consumers.values()) {
            consumer.close();
        }
    
        for (let transport of this.recvTransport.values()) {
            transport.close();
        }
        this.device = undefined;
        this.joined = false;
        this.sendTransport?.close();
    }

    public async join(token: string, userId?: number, channelId?: number) {
        try {
            if (this.joined && channelId !== this.channelId || userId !== this.channelId) {
                this.cleanUpSocket();
                if (!this.socket) throw new Error("Failed to re-join to server.");
                if (userId) this.userId = userId;
                if (channelId) this.channelId = channelId;
                this.configureSocket(this.socket);
            }

            this.device = new Device();
            this.socket.emit("join", this.channelId.toString(), this.userId, token, async (rtpCapabilities: RtpCapabilities) => {
                if (!this.device?.loaded) {
                    await this.device?.load({routerRtpCapabilities: rtpCapabilities});
                }
                this.joined = true;
                this.emit("join");
            });

            this.socket.emit("userList", this.channelId.toString(), token, async (peers: any) => {
                for (let mediaUser of peers) {
                    if (mediaUser.userId === userId) continue; // 본인 제외
                    for (let producer of mediaUser.producerIds) {
                        await this.createRecvTransport(this.channelId, this.userId, token); // RecvTransport 만들고
                        await this.startReceive(producer.type, producer.kind, mediaUser.userId, token); // Consumer 생성
                    }
                }
            });
        } catch (err) {
            console.error(err);
        }
    }

    public async startSend(type: MediaType, kind: any, token: string, track: MediaStreamTrack) {
        if (!this.sendTransport) {
            await this.createSendTransport(token);
        }
        
        let producer = await this.sendTransport!.produce({
            track: track
        });
    
        producer.appData.type = type;
        producer.appData.kind = kind;
    
        if (producer.track) {
            producer.track.onended = async () => {
                this.socket.emit("closeProducer", this.channelId, this.userId, producer.id);
            }
        }
    
        this.producers.set(producer.id, producer);
    }

    public async startReceive(type: keyof MediaType, kind: MediaKind, mediaUserId: number, token: string) {
        let found = this.recvTransport.get(mediaUserId);
    
        if (!found) {
            await this.createRecvTransport(this.channelId, this.userId, token);
            found = this.recvTransport.get(mediaUserId);
            if (!found) {
                throw new Error("Failed to create RecvTransport.");
            }
        }
    
        this.socket.emit("receiveTransport", this.channelId.toString(), this.userId, found.id, mediaUserId, type, kind, this.device?.rtpCapabilities, token, async (consumer: any) => {
            let newConsumer = await found!.consume({
                id: consumer.consumerId,
                producerId: consumer.producerId,
                kind: consumer.kind,
                rtpParameters: consumer.rtpParameters,
                appData: {
                    type: consumer.type,
                    userId: this.userId
                }
            });
    
            this.consumers.set(newConsumer.id, newConsumer);
            while (found!.connectionState !== 'connected') {
                await sleep(100);
            }
        
            async function sleep(ms: number) {
                return new Promise<void>((r) => setTimeout(() => r(), ms));
            }

            await this.resumeConsumer(newConsumer.id, token);
            this.emit("startRecv", mediaUserId, consumer.appData.type, consumer.kind, new MediaStream([newConsumer.track.clone()]));
        });
    }
// #endregion
// #region createTransport
    private async createSendTransport(token: string) {
        if (!this.device) {
            throw new Error("use device without initialization");
        }
        if (!this.sendTransport) {
            this.socket.emit("createSendTransport", this.channelId.toString(), this.userId, token, (transportId: string, iceParameters: IceParameters, iceCandidates: IceCandidate[], dtlsParameters: DtlsParameters) => {
                let newTransport = this.device!.createSendTransport({
                    id: transportId,
                    iceCandidates: iceCandidates,
                    dtlsParameters: dtlsParameters,
                    iceParameters: iceParameters
                });
                this.sendTransport = newTransport;
    
                newTransport.on("connect", async ({dtlsParameters}, callback, errback) => {
                    try {
                        this.socket.emit("connectTransport", this.channelId.toString(), this.userId, newTransport.id, dtlsParameters, token, (response: any) => {
                            if (response.error) {
                                errback(response.error);
                                return;
                            }
                            callback();
                        });
                    } catch (err) {
                        // @ts-ignore
                        errback(err);
                    }
                });
            
                newTransport.on("produce", async ({kind, rtpParameters, appData}, callback, errback) => {
                    try {
                        let paused = true;
                        this.socket.emit("sendTransport", this.channelId, this.userId, newTransport.id, paused, appData.type, kind, rtpParameters, token, (producer: any) => {
                            if (producer.error) {
                                errback(producer.error);
                                return;
                            }
                            callback({id: producer.id});
                        });
                    } catch (err) {
                        // @ts-ignore
                        errback(err);
                    }
                });
            
                newTransport.on("connectionstatechange", (state) => {
                    switch (state) {
                        case "connected":
                            console.log("[connect]transport %s", newTransport.id);
                            break;
                    }
                });
            });
        }
    }

    private async createRecvTransport(channelId: number, userId: number, token: string) {
        if (!this.device) {
            throw new Error("use device without initialization");
        }
        this.socket.emit("createRecvTransport", channelId.toString(), userId, token, (transportId: string, iceParameters: IceParameters, iceCandidates: IceCandidate[], dtlsParameters: DtlsParameters) => {
            let newTransport = this.device!.createRecvTransport({
                id: transportId,
                iceCandidates: iceCandidates,
                dtlsParameters: dtlsParameters,
                iceParameters: iceParameters
            });
            this.recvTransport.set(userId, newTransport);
            newTransport.appData.userId = userId;
            newTransport.on("connect", async ({dtlsParameters}, callback, errback) => {
                try {
                    this.socket.emit("connectTransport", channelId.toString(), userId, newTransport.id, dtlsParameters, token, (response: any) => {
                        if (response.error) {
                            errback(response.error);
                            return;
                        }
                        callback();
                    });
                } catch (err) {
                    // @ts-ignore
                    errback(err);
                }
            });
        });
    }
// #endregion
// #region consumer and producers
    public async pauseConsumer(consumerId: string, token: string) {
        this.socket.emit("pauseConsumer",  this.channelId, this.userId, consumerId, token, ({result}: any) => {
            if (result) this.consumers.get(consumerId)?.pause();
        });
    }
    
    public async pauseProducer(producerId: string, token: string) {
        this.socket.emit("pauseProducer",  this.channelId, this.userId, producerId, token, ({result}: any) => {
            if (result) this.producers.get(producerId)?.pause();
        });
    }
    
    public async resumeConsumer(consumerId: string, token: string) {
        this.socket.emit("resumeConsumer",  this.channelId, this.userId, consumerId, token, ({result}: any) => {
            if (result) this.consumers.get(consumerId)?.resume();
        });
    }
    
    public async resumeProducer(producerId: string, token: string) {
        this.socket.emit("resumeProducer",  this.channelId, this.userId, producerId, token, ({result}: any) => {
            if (result) this.producers.get(producerId)?.resume();
        });
    }
    
    public async closeProducer(producerId: string, token: string) {
        this.socket.emit("closeProducer",  this.channelId, this.userId, producerId, token, ({result}: any) => {
            if (result) this.producers.get(producerId)?.close();
        });
    }
    
    public async closeConsumer(consumerId: string, token: string) {
        this.socket.emit("closeConsumer",  this.channelId, this.userId, consumerId, token, ({result}: any) => {
            if (result) this.consumers.get(consumerId)?.resume();
        });
    }
// #endregion
    public async getMedia(type: keyof MediaType): Promise<MediaStream> {
        let ret: MediaStream;
        switch (type) {
            case "Camera":
                ret = await navigator.mediaDevices.getUserMedia({audio: false, video: true});
                break;
            case "Voice":
                ret = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
                break;
            case "Screen":
                ret = await navigator.mediaDevices.getDisplayMedia({audio: true, video: true});
                break;
            case "Mobile":
                throw new Error("Failed to get stream. try it on your mobile device.");
            default:
                throw new Error(`Failed to get stream. MediaType can't be ${type}`);
        }
        return ret;
    }

    private getToken() {
        const [userCookie, setCookie] = useUserCookie();
        const token = (userCookie as IUserIdentifier).token;
        return token;
    }
}

export interface MediaType {
    Screen: string,
    Camera: string,
    Voice: string,
    Mobile: string
}

export type MediaKind = "audio" | "video"