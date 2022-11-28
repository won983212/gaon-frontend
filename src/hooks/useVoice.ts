import { VoiceController } from "@/pages/Workspace/Conference/voice";
import { Socket } from "socket.io-client";

export class VoiceSingleton {
    private static _instance?: VoiceController;
    private static channelId: number = -1;
    private static userId: number = -1;
    private constructor() {}

    public static getInstance(socket: Socket | undefined, channelId: number, userId: number | undefined, token: string | undefined) {
        if (VoiceSingleton._instance) {
            if (!socket) {
                throw new Error("Failed to create new VoiceController");
            }

            if (!VoiceSingleton._instance.clean) {
                if (!channelId || !userId || !token) throw new Error("Failed" +
                    " to discard VoiceController");
                VoiceSingleton._instance = new VoiceController(socket, channelId, userId, token);
                return VoiceSingleton._instance;
            }

            if (this.channelId === channelId && this.userId === userId) {
                return VoiceSingleton._instance;
            }

            if (userId && channelId >= 0 && token) {
                VoiceSingleton._instance.cleanUpSocket(token);
                VoiceSingleton._instance.userId = userId;
                VoiceSingleton._instance.channelId = channelId;
                VoiceSingleton.channelId = channelId;
                VoiceSingleton.userId = userId;
            }
        }
        
        if (socket && channelId >= 0 && userId && token) {
            VoiceSingleton.channelId = channelId;
            VoiceSingleton.userId = userId;
            VoiceSingleton._instance = new VoiceController(socket, channelId, userId, token);
            return VoiceSingleton._instance;
        }

        throw new Error("Failed to get VoiceController.");
    }
}