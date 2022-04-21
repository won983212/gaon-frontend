export interface IChannel {
    id: number;
    name: string;
}

export interface IChannelCategory {
    id: number;
    name: string;
    channels: IChannel[];
}

export interface IUser {
    id: number;
    nickname: string;
    email: string;
}
