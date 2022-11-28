import { del, get, post, put, useHTTPGetSWR } from '@/api/client';
import { IChannel } from '@/types';

export const useChannelInfoSWR = (channelId: number) =>
    useHTTPGetSWR<IChannel>(
        channelId < 0 ? undefined : `/channel/${channelId}`
    );

export const getChannels = (groupId: number) =>
    get<IChannel[]>(`/channel/list/${groupId}`);

export const createChannel = (
    projectId: number,
    groupId: number,
    userId: number,
    name: string,
    type: string,
    token: string
) =>
    post<IChannel>(
        `/channel/`,
        {
            projectId: projectId,
            groupId: groupId,
            userId: userId,
            name: name,
            type: type
        },
        { 'x-access-token': token }
    );

export const deleteChannel = (
    projectId: number,
    userId: number,
    channelId: number,
    groupId: number,
    token: string
) =>
    del(`/channel/${channelId}?userId=${userId}&groupId=${groupId}&projectId=${projectId}`, {
        'x-access-token': token
    });

export const updateChannel = (
    projectId: number,
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
            projectId: projectId,
            userId: userId,
            groupId: groupId,
            name: new_name,
            type: new_type
        },
        { 'x-access-token': token }
    );
};
