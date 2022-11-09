export type ChannelType = 'empty' | 'chatting' | 'conference';

export interface IChannel {
    id: number;
    type: ChannelType;
    name: string;
}

export interface IChannelGroup {
    id: number;
    name: string;
}

export interface IFileNode {
    id?: string;
    name: string;
    files?: IFileNode[];
}

export type MessageType = 'text' | 'file';

export interface IMessage {
    type: MessageType;
    sender: string;
    date: number;
}

export interface TextMessage extends IMessage {
    type: 'text';
    message: string;
}

export interface FileMessage extends IMessage {
    type: 'file';
    name: string;
    url: string;
}

export type UserStatus = 'online' | 'offline' | 'missed';

export interface IUser {
    id: number;
    userId: string;
    username: string;
    name: string;
    email: string;
    status: UserStatus;
    job: string;
}

export interface IUserIdentifier {
    id: number;
    userId: string;
    token: string;
}

export interface IConnectedUser {
    socketId: string;
    username: string;
    mute: boolean;
}

export interface Position {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface IWorkspace {
    id: number;
    name: string;
    createdBy: number;
    groups?: Array<IChannelGroup>;
}
