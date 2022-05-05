export type IStatus = 'online' | 'offline' | 'missed';

export interface IChannel {
    id: number;
    name: string;
}

export interface IChannelGroup {
    id: number;
    name: string;
    channels: IChannel[];
}

export interface IUser {
    userId: string;
    username: string;
    name: string;
    email: string;
    avatarUrl: string;
    status: IStatus;
    job: string;
}
