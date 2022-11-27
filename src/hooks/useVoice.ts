import { VoiceController } from "@/pages/Workspace/Conference/voice";
import { Socket } from "socket.io-client";

export class VoiceSingleton {
    private static _instance?: VoiceController;
    private static channelId: number = -1;
    private static userId: number = -1;
    private constructor() {}

    public static getInstance(socket?: Socket, channelId?: number, userId?: number) {
        if (VoiceSingleton._instance && socket?.disconnected) {
            if (VoiceSingleton._instance.clean === false) {
                if (!channelId || !userId) throw new Error("Failed to discard VoiceController");
                VoiceSingleton._instance = new VoiceController(socket, channelId, userId);
                return VoiceSingleton._instance;
            }

            if (channelId === channelId && userId === userId) {
                return VoiceSingleton._instance;
            }

            if (!socket) {
                throw new Error("Failed to create new VoiceController");
            }

            if (userId && channelId) {
                VoiceSingleton._instance.cleanUpSocket();
                VoiceSingleton._instance.userId = userId;
                VoiceSingleton._instance.channelId = channelId;
                VoiceSingleton.channelId = channelId;
                VoiceSingleton.userId = userId;
            }
        }
        
        if (socket && channelId && userId) {
            VoiceSingleton.channelId = channelId;
            VoiceSingleton.userId = userId;
            VoiceSingleton._instance = new VoiceController(socket, channelId, userId);
            return VoiceSingleton._instance;
        }

        throw new Error("Failed to get VoiceController.");
    }
}