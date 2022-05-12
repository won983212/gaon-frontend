export type ChannelType = 'chatting' | 'conference';

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

export interface IFileNode {
    id?: string;
    name: string;
    files?: IFileNode[];
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
