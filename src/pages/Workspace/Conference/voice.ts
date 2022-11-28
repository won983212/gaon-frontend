import { Socket } from 'socket.io-client';
import { EventEmitter } from 'events';
import { Device } from 'mediasoup-client';
import { Consumer } from 'mediasoup-client/lib/Consumer';
import { Producer } from 'mediasoup-client/lib/Producer';
import {
    DtlsParameters,
    IceCandidate,
    IceParameters,
    Transport
} from 'mediasoup-client/lib/Transport';

export class VoiceController extends EventEmitter {
    private socket: Socket;
    private _channelId: number;
    private _userId: number;
    private consumers: Map<string, Consumer>;
    private producers: Map<string, Producer>;
    private recvTransport: Map<number, Transport>;
    private sendTransport?: Transport;
    private device?: Device;
    private joined: boolean;
    private type: string;

    public constructor (socket: Socket, channelId: number, userId: number, token: string) {
        super();
        this.device = new Device();
        this.socket = socket;
        this._channelId = channelId;
        this._userId = userId;
        this.consumers = new Map<string, Consumer>();
        this.producers = new Map<string, Producer>();
        this.recvTransport = new Map<number, Transport>();
        this.configureSocket(socket, token);
        this.joined = false;
        this.type = 'Voice';
    }

    //public static build(socket: Socket, channelId: number, userId: number) {
    //    return new VoiceController(socket, channelId, userId);
    //}

    private configureSocket(socket: Socket, token: string) {
        socket.on("newUser", ({userId}) => {
            this.emit("newUser", userId);
        });

        socket.on("establishNewSendTransport", async (userId: number) => {
            await this.createRecvTransport(this._channelId, this._userId, token);
            console.log(`${userId} start new send transport`);
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
            console.log("Start Receive1")
            await this.startReceive(type, kind, userId, token);
            // this.emit("startProduce", userId, type, kind);
        });
    }

    public get channelId(): number {
        return this._channelId;
    }

    public set channelId(value: number) {
        this._channelId = value;
    }

    public get userId(): number {
        return this._userId;
    }

    public set userId(value: number) {
        this._userId = value;
    }

    public get clean() {
        return !this.joined;
    }
// #region method called directly
    public cleanUpSocket(token: string) {
        console.log("CleanUP", token)
        throw new Error()
        this.socket.off("newUser");
        this.socket.off("establishNewSendTransport");
        this.socket.off("userLeave");
        this.socket.off("startProduce");
        this.socket.emit("leave", this._channelId, this._userId, token);
        for (let producer of this.producers.values()) {
            producer.close();
        }

        for (let consumer of this.consumers.values()) {
            consumer.close();
        }

        for (let transport of this.recvTransport.values()) {
            transport.close();
        }
        //this.device = undefined;
        this.sendTransport?.close();
        this.socket.disconnect();
    }

    public async join(token: string, userId?: number, channelId?: number) {
        try {
            if (this.joined && (channelId !== this._channelId || userId !== this.userId)) {
                this.cleanUpSocket(token);
                if (!this.socket) throw new Error("Failed to re-join to server.");
                if (userId) this._userId = userId;
                if (channelId) this._channelId = channelId;
                this.configureSocket(this.socket, token);
            }

            if(this.joined){
                return;
            }
            this.joined = true;

            this.socket.emit("join", this._channelId.toString(), this._userId, token, async (rtpCapabilities: any) => {
                if(rtpCapabilities.error){
                    console.error(`Failed to join room. ${rtpCapabilities.error}`);
                    return;
                }
                if (!this.device?.loaded) {
                    await this.device?.load({routerRtpCapabilities: rtpCapabilities});
                }
                this.emit("join");

                this.socket.emit("userList", this._channelId.toString(), token, async (peers: any) => {
                    if(peers.error){
                        console.error(`Can't emit userList. ${peers.error}`);
                        return;
                    }
                    for (let mediaUser of peers) {
                        //if (mediaUser.userId === userId) continue; // 본인 제외
                        for (let producer of mediaUser.producerIds) {
                            console.log("Start Receive2")
                            await this.createRecvTransport(this._channelId, this._userId, token); // RecvTransport 만들고
                            await this.startReceive(producer.type, producer.kind, mediaUser.userId, token); // Consumer 생성
                        }
                    }
                    console.log(peers)
                });
            });
        } catch (err) {
            console.error(err);
        }
    }

    public async startSend(type: keyof MediaType, kind: MediaKind, token: string, track: MediaStreamTrack) {
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
                this.socket.emit("closeProducer", this._channelId, this._userId, producer.id);
            }
        }

        this.producers.set(producer.id, producer);
    }

    public async startReceive(type: keyof MediaType, kind: MediaKind, mediaUserId: number, token: string) {
        let found = this.recvTransport.get(mediaUserId);

        if (!found) {
            await this.createRecvTransport(this._channelId, this._userId, token);
            found = this.recvTransport.get(mediaUserId);
            if (!found) {
                throw new Error("Failed to create RecvTransport.");
            }
        }

        this.socket.emit("receiveTransport", this._channelId.toString(), this._userId, found.id, mediaUserId, type, kind, this.device?.rtpCapabilities, token, async (consumer: any) => {
            if(consumer.error){
                console.error(`Can't emit receiveTransport. ${consumer.error}`);
                return;
            }

            let newConsumer = await found!.consume({
                id: consumer.consumerId,
                producerId: consumer.producerId,
                kind: consumer.kind,
                rtpParameters: consumer.rtpParameters,
                appData: {
                    type: consumer.type,
                    userId: this._userId
                }
            });

            this.consumers.set(newConsumer.id, newConsumer);
            while (found!.connectionState !== 'connected') {
                await this.sleep(100);
            }

            await this.resumeConsumer(newConsumer.id, token);
            this.emit("startRecv", mediaUserId, this.type, consumer.kind, new MediaStream([newConsumer.track.clone()]));
        });
    }
// #endregion
// #region createTransport
    private async createSendTransport(token: string) {
        if (!this.device) {
            throw new Error("use device without initialization");
        }
        if (!this.sendTransport) {
            this.socket.emit("createSendTransport", this._channelId.toString(), this._userId, token, (params: any) => {
                if(params.error){
                    console.error(`Can't emit createSendTransport. ${params.error}`);
                    return;
                }
                let newTransport = this.device!.createSendTransport({
                    id: params.transportId,
                    iceCandidates: params.iceCandidates,
                    dtlsParameters: params.dtlsParameters,
                    iceParameters: params.iceParameters
                });
                this.sendTransport = newTransport;

                newTransport.on("connect", async ({dtlsParameters}, callback, errback) => {
                    try {
                        this.socket.emit("connectTransport", this._channelId.toString(), this._userId, newTransport.id, dtlsParameters, token, (response: any) => {
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
                        this.socket.emit("sendTransport", this._channelId, this._userId, newTransport.id, paused, this.type, kind, rtpParameters, token, (producer: any) => {
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

            while (!this.sendTransport) {
                await this.sleep(100);
            }
        }
    }

    private async createRecvTransport(channelId: number, userId: number, token: string) {
        console.log("createRecvTransport")
        if (!this.device) {
            throw new Error("use device without initialization");
        }

        let flag = false
        this.socket.emit("createRecvTransport", channelId.toString(), userId, token, (params: any) => {
            if(params.error){
                console.error(`Can't emit createRecvTransport. ${params.error}`);
                return;
            }
            let newTransport = this.device!.createRecvTransport({
                id: params.transportId,
                iceCandidates: params.iceCandidates,
                dtlsParameters: params.dtlsParameters,
                iceParameters: params.iceParameters
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
            flag = true
        });

        while (!flag) {
            await this.sleep(100);
        }
    }
// #endregion
// #region consumer and producers
    public async pauseConsumer(consumerId: string, token: string) {
        this.socket.emit("pauseConsumer",  this._channelId, this._userId, consumerId, token, ({result}: any) => {
            if (result) this.consumers.get(consumerId)?.pause();
        });
    }

    public async pauseProducer(producerId: string, token: string) {
        this.socket.emit("pauseProducer",  this._channelId, this._userId, producerId, token, ({result}: any) => {
            if (result) this.producers.get(producerId)?.pause();
        });
    }

    public async resumeConsumer(consumerId: string, token: string) {
        this.socket.emit("resumeConsumer",  this._channelId, this._userId, consumerId, token, ({result}: any) => {
            if (result) this.consumers.get(consumerId)?.resume();
        });
    }

    public async resumeProducer(producerId: string, token: string) {
        this.socket.emit("resumeProducer",  this._channelId, this._userId, producerId, token, ({result}: any) => {
            if (result) this.producers.get(producerId)?.resume();
        });
    }

    public async closeProducer(producerId: string, token: string) {
        this.socket.emit("closeProducer",  this._channelId, this._userId, producerId, token, ({result}: any) => {
            if (result) this.producers.get(producerId)?.close();
        });
    }

    public async closeConsumer(consumerId: string, token: string) {
        this.socket.emit("closeConsumer",  this._channelId, this._userId, consumerId, token, ({result}: any) => {
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

    private async sleep(ms: number) {
        return new Promise<void>((r) => setTimeout(() => r(), ms));
    }
}

export interface MediaType {
    Screen: string,
    Camera: string,
    Voice: string,
    Mobile: string
}

export type MediaKind = "audio" | "video"