export type ChannelType = 'chatting' | 'board-sharing' | 'web-sharing';

export interface IChannel {
    id: number;
    type: ChannelType;
    name: string;
}

export interface IChannelGroup {
    id: number;
    name: string;
    channels: IChannel[];
}

export type IStatus = 'online' | 'offline' | 'missed';

export interface IUser {
    userId: string;
    username: string;
    name: string;
    email: string;
    avatarUrl: string;
    status: IStatus;
    job: string;
}
