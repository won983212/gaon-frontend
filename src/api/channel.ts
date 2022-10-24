import { del, get, post, put, useHTTPGetSWR } from '@/api/client';
import { IChannel } from '@/types';

export const useChannelInfoSWR = (channelId: number) =>
    useHTTPGetSWR<IChannel>(`/channel/${channelId}`);

export const getChannels = (groupId: number) =>
    get<IChannel[]>(`/channel/list/${groupId}`);

export const createChannel = (
    groupId: number,
    userId: number,
    name: string,
    type: string,
    token: string
) =>
    post<IChannel>(
        `/channel/`,
        {
            groupId: groupId,
            userId: userId,
            name: name,
            type: type
        },
        { 'x-access-token': token }
    );

export const deleteChannel = (
    userId: number,
    channelId: number,
    groupId: number,
    token: string
) =>
    del(`/channel/${channelId}?userId=${userId}&groupId=${groupId}`, {
        'x-access-token': token
    });

export const updateChannel = (
    userId: number,
    channelId: number,
    groupId: number,
    token: string,
    new_name?: string,
    new_type?: string
) => {
    if (!(new_type || new_name)) {
        return new Promise((resolve, reject) => {
            reject('Invalid argument type.');
        });
    }
    return put(
        `/channel/${channelId}`,
        {
            userId: userId,
            groupId: groupId,
            name: new_name,
            type: new_type
        },
        { 'x-access-token': token }
    );
};
