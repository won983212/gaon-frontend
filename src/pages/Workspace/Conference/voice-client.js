import * as client from 'mediasoup-client';
import { Consumer, Producer } from 'mediasoup-client/lib/types';
import io, { connect } from 'socket.io-client';
import { EventEmitter } from 'events';

//const client = require("mediasoup-client");
const host = "/voice";
const socketHost = "/voice-ws"; // Proxy가 잘못 설정되었다.
const mediaType = "voice";
const root = document.getElementById("rtc-root");

let manager;
let ctx = undefined;

if (!root) {
    console.error(`HTML element rtc-root does not exist`);
}

export function isContextActive(){
    return ctx !== undefined;
}

export async function initializeContext(userId, roomId){
    if(ctx === undefined) {
        manager = new ElementManager(root);
        ctx = new Context(userId, roomId, "token");

        ctx.on('leave', () => {
            manager.clear();
        });

        ctx.on('video-consume', (consumer, mediaType) => {
            manager.createChildElementByConsumer(consumer, true);
        });

        ctx.on('audio-consume', (consumer, mediaType) => {
            manager.createChildElementByConsumer(consumer, true);
        });

        ctx.on('end-recv', (consumer, mediaType) => {
            manager.deleteElementByConsumer(consumer);
        });

        ctx.on('user-leave', (userId) => {
            console.log(`user-leave ${userId}`);
            let consumers = ctx.findConsumerByUser(userId);
            for (let consumer of consumers) {
                manager.deleteElementByConsumer(consumer);
            }
        });

        ctx.on('user-produce', async (userId, type, kind) => {
            let recv = await ctx.startRecv(userId, type, kind);
            console.log(`${userId} start ${type} ${kind}: ${recv}`);
        });
    }
}

export async function joinToVoiceServer(userId) {
    await ctx.join();
    let media = await ctx.startMedia(mediaType);
    let send = await ctx.startSend(media, mediaType);
    let roomState = await ctx.getRoomState();
    for (let peer of roomState.peerList) {
        if (peer.userId === userId) continue;
        for (let producer of peer.producerIds) {
            let recv = await ctx.startRecv(peer.userId, producer.type, producer.kind);
            console.log(`${peer.userId}, ${producer.type}, ${producer.kind}, ${recv}`);
        }
    }
}

export async function leaveContext() {
    ctx.leave();
    ctx = undefined;
}

export async function kick(targetId, token) {
    ctx.kick(targetId, token);
}

export class ElementManager {
    /**
     * @param {HTMLElement} rootElement 
     */
    constructor(rootElement) {
        this.rootElement = rootElement;
    }

    /**
     * @param {Producer} producer
     * @param {boolean} visible
     */
    createChildElementByProducer(producer, visible) {
        let kind = producer.appData.kind;
        let type = producer.appData.type;
        let id = `producer-${kind}-${type}`;
        console.log(`trying to create ${id}`);
        
        switch (kind) {
            case "audio":
                let audioElement = document.createElement("audio");
                audioElement.setAttribute("id", id);
                audioElement.setAttribute("playsinline", "true");
                audioElement.setAttribute("autoplay", "true");
                if (!visible) {
                    audioElement.setAttribute("hidden", "true");
                }
                this.rootElement.appendChild(audioElement);
                if (producer.track) {
                    audioElement.srcObject = new MediaStream([producer.track.clone()]);
                    audioElement.play();
                }
                break;
            case "video":
                let videoElement = document.createElement("video");
                videoElement.setAttribute("id", id);
                videoElement.setAttribute("playsinline", "true");
                videoElement.width = 400;
                videoElement.height = 400;
                videoElement.setAttribute("autoplay", "true");
                //videoElement.setAttribute("width", "480");
                //videoElement.setAttribute("height", "480");
                if (!visible) {
                    videoElement.setAttribute("hidden", "true");
                }
                this.rootElement.appendChild(videoElement);
                if (producer.track) {
                    videoElement.srcObject = new MediaStream([producer.track.clone()]);
                    videoElement.muted = true;
                    videoElement.play();
                    videoElement.muted = false;
                }
                break;
            default:
                console.error(`Failed to create element ${id}`);
                break;
        }
    }

    /**
     * @param {Consumer} consumer 
     * @param {boolean} visible
     */
    createChildElementByConsumer(consumer, visible) {
        let kind = consumer.appData.kind;
        let type = consumer.appData.type;
        let userId = consumer.appData.userId;
        let id = `${kind}-${type}-${userId}`;
        console.log(`trying to create ${id}`);
        
        switch (kind) {
            case "audio":
                let audioElement = document.createElement("audio");
                audioElement.setAttribute("id", id);
                audioElement.setAttribute("playsinline", "true");
                audioElement.setAttribute("autoplay", "true");
                if (!visible) {
                    audioElement.setAttribute("hidden", "true");
                }
                this.rootElement.appendChild(audioElement);
                audioElement.srcObject = new MediaStream([consumer.track.clone()]);
                audioElement.play();
                break;
            case "video":
                let videoElement = document.createElement("video");
                videoElement.setAttribute("id", id);
                videoElement.setAttribute("playsinline", "true");
                videoElement.setAttribute("autoplay", "true");
                if (!visible) {
                    videoElement.setAttribute("hidden", "true");
                }
                this.rootElement.appendChild(videoElement);
                videoElement.srcObject = new MediaStream([consumer.track.clone()]);
                videoElement.play();
                break;
            default:
                console.error(`Failed to create element ${id}`);
                break;
        }
    }

    /**
     * @param {Consumer} consumer 
     */
    deleteElementByConsumer(consumer) {
        let kind = consumer.appData.kind;
        let type = consumer.appData.type;
        let userId = consumer.appData.userId;
        let id = `${kind}-${type}-${userId}`;
        let element = document.getElementById(id);
        console.log(`trying to remove ${id}`);
        if (element) {
            element.remove();
        }
    }

    clear() {
        this.rootElement.innerHTML = "";
    }
}

export class Context extends EventEmitter {
    /**
     * @param {number} userId
     * @param {string} roomId
     * @param {string?} token
     */
    constructor(userId, roomId, token) {
        super();
        this.io = io(`/`, {
            path: '/voice-ws/socket.io',
            transports: ['websocket']
        });
        // connect(socketHost, {withCredentials: false});
        this._device = new client.Device();
        this._roomId = roomId;
        this._userId = userId;
        this._token = token;
        this.sendTransport = undefined;
        this.recvTransports = new Map();
        this.producers = new Map();
        this.consumers = new Map();
        this.interval = 1000;
        this.joined = false;
        this.roomState = {};
    }
//#region public
    async join() {
        try {
            console.log("StartJoin");
            if (this.joined) return;
            window.addEventListener('beforeunload', () => this.leave());
            let {routerRtpCapabilities} = await this.HttpRequest(`/room/${this._roomId}/user/${this._userId}/join`);
            this.loadDevice(routerRtpCapabilities);
            this.joined = true;
            let socket_conn = await this.waitSocketConnection(100, 10000);
            console.log("Request result: ", socket_conn);
            if (!socket_conn) {
                console.log("Failed to connect socket server.1");
            }
            console.log("getRoom state");
            this.emit("join", this._roomId, this._userId);
            console.log("Join Done");
        } catch (err) {
            console.error(err);
            this.leave();
        }

        //let timer = setInterval(async() => {
        //    //heartbeat logic
        //    if (!this.heartbeat()) {
        //        clearInterval();
        //        leave();
        //        return;
        //    }
        //}, this.interval);
    }

    /**
     * @param {number} checkInterval
     * @param {number} timeout
     */
    async waitSocketConnection(checkInterval, timeout) {
        let ARK = false;
        this.io.emit("silentJoin", this._roomId, this._userId, "token", (response) => {
            console.log(response);
            ARK = true;
        });
        let i = 0
        // @ts-ignore
        while (ARK !== true) {
            i++;
            await this.sleep(checkInterval);
            if (i >= timeout / checkInterval) {
                console.log("Failed to connect socket server.2");
                await this.leave();
                this.io.disconnect();
                return false;
            }
        }

        this.io.on("disconnect", () => {
            try {
                this.leave();
            } catch (err) {
                console.log(err);
            }
        });

        this.io.on("userLeave", (response) => {
            this.emit('user-leave', response.userId);
        });

        this.io.on("startProduce", (userId, type, kind) => {
            console.log("user-produce called");
            this.emit('user-produce', userId, type, kind);
        });
        return true;
    }

    async getRoomState() {
        this.roomState = await this.HttpRequest(`/room/${this._roomId}/users`);
        return this.roomState;
    }

    async leave() {
        if (!this.joined) {
            return true;
        }

        try {
            //clearInterval(this.interval);
            let response = await this.HttpRequest(`/room/${this._roomId}/user/${this._userId}/leave`);
            this.joined = false;
            this.sendTransport && await this.sendTransport.close();
            if (this.recvTransports.size !== 0) {
                this.recvTransports.forEach((value) => {
                    value.close();
                });
                this.recvTransports.clear();
            }
            this.consumers.clear();
            this.producers.clear();
            this.roomState = {};
            this.io.emit('leaveSignal', this._roomId, this._userId);
            this.emit('leave');
            return response.result;
        } catch (err) {
            console.error(err);
        }
        return false;
    }

    async kick(targetId, token) {
        if (!this.joined) {
            return false;
        }

        try {
            this.io.emit("kick", this._roomId, this._userId, targetId, token, ({userId}) => {
                console.log(userId, " kicked");
            })
        } catch (err) {
            console.error(err);
        }
        return true;
    }
    /**
     * @param {"Voice" | "Camera" | "Screen"} mediaType
     * 미디어를 시작
     */
    async startMedia(mediaType) {
        if (!this.joined) {
            return;
        }
        try {
            if (!this.sendTransport) {
                this.sendTransport = await this.createWebRtcTransport('send');
            }

            let media;
            switch (mediaType.toLowerCase()) {
                case "voice":
                    media = await navigator.mediaDevices.getUserMedia({audio: true});
                    break;
                case "screen":
                    media = await navigator.mediaDevices.getDisplayMedia({audio: true, video: true});
                    break;
                case "camera":
                    media = await navigator.mediaDevices.getUserMedia({video: true});
                    break;
                default:
                    throw new Error(`Failed to start media ${mediaType}`);
            }

            if (!media) {
                throw new Error(`Failed to get media ${mediaType}`);
            }

            return media;
        } catch (err) {
            console.error(err.message);
        }
    }

    /**
     * @param {MediaStream | undefined} media
     * @param {string} mediaType
     */
    async startSend(media, mediaType) {
        if (!this.joined || !media) {
            return;
        }
        // sendTransport가 없으면 만든다.
        if (!this.sendTransport) {
            this.sendTransport = await this.createWebRtcTransport('send');
            if (!this.sendTransport) return;
        }

        // 각 트랙에 해당하는 프로듀서를 만든다.
        if (media.getVideoTracks().length) {
            let producer = await this.sendTransport.produce({
                track: media.getVideoTracks()[0],
                encodings: undefined,
                appData: {type: mediaType, kind: 'video'}
            });
            this.producers.set(producer.id, producer);
            console.log(producer.id + " is set.");

            if (producer.track) {
                producer.track.onended = async () => {
                    console.log(`${mediaType}-video stopped`);
                    try {
                        let result = await this.pauseProducer(producer, this._roomId, this._userId);
                        result = await this.closeProducer(producer, this._roomId, this._userId);
                        this.producers.delete(producer.id);
                    } catch (err) {
                        console.error(err);
                    }
                }
            }

            this.producers.set(producer.id, producer);
            console.log(producer.id + " is set.");
            this.emit('video-produce', producer, mediaType);
            this.io.emit("sendSignal", this._userId, mediaType, 'video', () => {
                console.log("send video produce signal");
            });
        }

        if (media.getAudioTracks().length) {
            let producer = await this.sendTransport.produce({
                track: media.getAudioTracks()[0],
                appData: {type: mediaType, kind: 'audio'}
            });
            this.producers.set(producer.id, producer);
            if (producer.track) {
                producer.track.onended = async () => {
                    console.log(`${mediaType}-audio stopped`);
                    try {
                        let result = await this.pauseProducer(producer, this._roomId, this._userId);
                        result = await this.closeProducer(producer, this._roomId, this._userId);
                        this.producers.delete(producer.id);
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
            this.producers.set(producer.id, producer);
            this.emit('audio-produce', producer, mediaType);
            this.io.emit("sendSignal", this._userId, mediaType, 'audio', () => {
                console.log("send audio produce signal");
            });
        }
        return true;
    }

    /**
     * @param {number} otherUserId
     * @param {"Screen" | "Camera" | "Voice"} mediaType
     * @param {"audio" | "video"} kind
     */
    async startRecv(otherUserId, mediaType, kind) {
        if (!this.joined) {
            return;
        }
        let transport = this.recvTransports.get(otherUserId);
        if (!transport) {
            transport = await this.createWebRtcTransport('recv', otherUserId);
        }

        let _consumer  = this.findConsumer(otherUserId, mediaType, kind);
        if (_consumer) {
            console.error("you already have consumer");
            return;
        }

        console.log(JSON.stringify(this._device.rtpCapabilities));
        let response = await this.HttpRequest(`/room/${this._roomId}/user/${this._userId}/transport/${transport.id}/recv/${otherUserId}`, {rtpCapabilities: this._device.rtpCapabilities, type: mediaType, kind: kind});
        let consumer = await transport.consume({
            id: response.consumerId,
            producerId: response.producerId,
            kind: response.kind,
            rtpParameters: response.rtpParameters,
            appData: {
                kind: response.kind,
                type: response.mediaType,
                userId: otherUserId
            }
        });

        while (transport.connectionState !== 'connected') {
            await this.sleep(100);
        }

        await this.resumeConsumer(consumer, this._roomId, this._userId);
        this.consumers.set(consumer.id, consumer);
        switch (kind) {
            case "audio":
                this.emit("audio-consume", consumer, mediaType);
                break;
            case "video":
                this.emit("video-consume", consumer, mediaType);
                break;
            default:
                console.error(`Invalid media kind ${kind}`);
        }
        // update UI
        // let remote_video = document.getElementById("video_remote");
        // remote_video.srcObject = new MediaStream([consumer.track.clone()]);
        // remote_video.play();
        return true;
    }

    /**
     * @param {number} otherUserId
     * @param {"Screen" | "Camera" | "Voice"} mediaType
     * @param {"audio" | "video"} kind
     */
    async endRecv(otherUserId, mediaType, kind) {
        if (!this.joined) {
            return;
        }

        let consumer = this.findConsumer(otherUserId, mediaType, kind);
        if (!consumer) {
            return;
        }

        try {
            let result = await this.closeConsumer(consumer, this._roomId, this._userId);
            this.emit('end-recv', consumer, mediaType);
            console.log("endRecv result", result);
        } catch (err) {
            console.error(err);
        }
    }
//#endregion
//#region producer and consumer control
    /**
     * @param {number} otherUserId
     * @param {"Screen" | "Camera" | "Voice"} type
     * @param {"audio" | "video"} kind
     */
    findConsumer(otherUserId, type, kind) {
        console.log(`findConsumer(${otherUserId},${type},${kind})`);
        let consumer;
        this.consumers.forEach((value) => {
            if (value.appData.userId === otherUserId &&
                value.appData.type === type &&
                value.kind === kind) {
                    consumer = value;
                    return;
            }
        });
        console.log(`findConsumer(${otherUserId},${type},${kind}) returns ${consumer}`);
        return consumer;
    }

    /**
     * @param {number} otherUserId
     */
    findConsumerByUser(otherUserId) {
        console.log(`findConsumersByUser(${otherUserId})`);
        let consumers = new Array();
        this.consumers.forEach((value) => {
            if (value.appData.userId === otherUserId) {
                consumers.push(value);
            }
        });
        return consumers;
    }
    /**
     * @param {Consumer} consumer
     * @param {string} roomId
     * @param {number} userId
     */
    async pauseConsumer(consumer, roomId, userId) {
        await this.HttpRequest(`/room/${roomId}/user/${userId}/consume/${consumer.id}/pause`);
        await consumer.pause();
        return consumer.paused;
    }

    /**
     * @param {Producer} producer
     * @param {string} roomId
     * @param {number} userId
     */
    async pauseProducer(producer, roomId, userId) {
        await this.HttpRequest(`/room/${roomId}/user/${userId}/produce/${producer.id}/pause`);
        await producer.pause();
        return producer.paused;
    }

    async resumeConsumer(consumer, roomId, userId) {
        await this.HttpRequest(`/room/${roomId}/user/${userId}/consume/${consumer.id}/resume`);
        await consumer.resume();
        return !consumer.paused;
    }

    /**
     * @param {Producer} producer
     * @param {string} roomId
     * @param {number} userId
     */
    async resumeProducer(producer, roomId, userId) {
        await this.HttpRequest(`/room/${roomId}/user/${userId}/produce/${producer.id}/resume`);
        await producer.resume();
        return !producer.paused;
    }

    /**
     * @param {Producer} producer
     * @param {string} roomId
     * @param {number} userId
     */
    async closeProducer(producer, roomId, userId) {
        await this.HttpRequest(`/room/${roomId}/user/${userId}/produce/${producer.id}/close`);
        await producer.close();
        return producer.closed;
    }

    /**
     * @param {Consumer} consumer
     * @param {string} roomId
     * @param {number} userId
     */
    async closeConsumer(consumer, roomId, userId) {
        await this.HttpRequest(`/room/${roomId}/user/${userId}/consume/${consumer.id}/close`);
        await consumer.close();
        this.consumers.delete(consumer);
        removeMediaView(consumer);
        return consumer.closed;
    }
//#endregion
//#region private functions
    async heartbeat() {

    }

    async loadDevice(routerRtpCapabilities) {
        try {
            if (!this._device.loaded) {
                await this._device.load({routerRtpCapabilities});
            }
        } catch (err) {
            console.error("Failed to load device.");
            console.error(err);
        }
    }

    async sleep(ms) {
        return new Promise((r) => setTimeout(() => r(), ms));
    }

    async createWebRtcTransport(transportType, otherUserId) {
        let transport = undefined;
        switch (transportType.toLowerCase()) {
            case "send":
                transport = await this.createSendTransport();
                this.sendTransport = transport;
                break;
            case "recv":
                transport = await this.createRecvTransport();
                this.recvTransports.set(otherUserId, transport);
                break;
            default:
                console.error(`Failed to create WebRtcTransport transportType is ${transportType}`);
                break;
        }
        return transport;
    }

    async createSendTransport() {
        try {
            let { transportId, iceParameters, iceCandidates, dtlsParameters } = await this.HttpRequest(`/room/${this._roomId}/user/${this._userId}/transport/create/send`);
            let transport = await this._device.createSendTransport({
                id: transportId,
                iceCandidates: iceCandidates,
                dtlsParameters: dtlsParameters,
                iceParameters: iceParameters
            });

            transport.on("connect", async ({dtlsParameters}, callback, errback) => {
                try {
                    await this.HttpRequest(`/room/${this._roomId}/user/${this._userId}/transport/${transport.id}/connect`, {dtlsParameters});
                    callback();
                    console.log("[SEND]Connection Success", JSON.stringify(dtlsParameters));
                } catch (err) {
                    console.error(`[SEND]Failed to connect transport ${transport.id}`);
                    errback(err);
                }
            });

            transport.on("produce", async ({kind, rtpParameters, appData}, callback, errback) => {
                let type = appData.type;
                try {
                    let {id} = await this.HttpRequest(`/room/${this._roomId}/user/${this._userId}/transport/${transport.id}/send`, {kind, type, rtpParameters, paused: true});
                    callback({id});
                    console.log(`Produce Success ${type}-${kind}`);
                } catch (err) {
                    errback(err);
                    console.log(`Produce Failed ${type}-${kind}`);
                }
            });

            transport.on("connectionstatechange", (state) => {
                switch (state) {
                    case "connected":
                    case "closed":
                    case "disconnected":
                    default:
                        break;
                }
            });

            return transport;
        } catch (err) {
            console.error(err);
        }
    }

    async createRecvTransport() {
        try {
            let { transportId, iceParameters, iceCandidates, dtlsParameters } = await this.HttpRequest(`/room/${this._roomId}/user/${this._userId}/transport/create/recv`);
            let transport = await this._device.createRecvTransport({
                id: transportId,
                iceCandidates: iceCandidates,
                dtlsParameters: dtlsParameters,
                iceParameters: iceParameters
            });

            transport.on("connect", async ({dtlsParameters}, callback, errback) => {
                try {
                    await this.HttpRequest(`/room/${this._roomId}/user/${this._userId}/transport/${transport.id}/connect`, {
                        dtlsParameters
                    });
                    console.log(dtlsParameters);
                    callback();
                    console.log("[RECV]Connection Success", JSON.stringify(dtlsParameters));
                } catch (err) {
                    console.error(`[RECV]Failed to connect transport ${transport.id}`);
                    errback(err);
                }
            });

            transport.on("connectionstatechange", (state) => {
                switch (state) {
                    case "connected":
                    case "closed":
                    case "disconnected":
                    default:
                        break;
                }
            });

            return transport;
        } catch (err) {
            console.error(err);
        }
    }

    async HttpRequest(path, body) {
        try {
            let header = { 'Content-Type': 'application/json'};
            let bodyData = JSON.stringify({...body});

            let res = await fetch(host + path, { method: 'POST', body: bodyData, headers: header});
            console.log("HTTPRequest[%s]", path, res);
            return await res.json();
        } catch (err) {
            console.log(err);
            return { err: err};
        }
    }
//#endregion
}