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

export interface IMessage {
    sender: string;
    message: string;
    date: number;
}

export type IStatus = 'online' | 'offline' | 'missed';

export interface IUser {
    userId: string;
    username: string;
    name: string;
    email: string;
    status: IStatus;
    job: string;
}

export interface IUserIdentifier {
    id: number;
    userId: string;
    token: string;
}

export interface Position {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}
