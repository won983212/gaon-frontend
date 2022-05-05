import { IChannel, IChannelGroup } from '@/types';
import { getWithSWR } from './client';

export const getChannelsSWR = (workspaceId: number) =>
    getWithSWR<IChannelGroup[]>(`/api/workspace/${workspaceId}/channels`);

export const getChannelInfoSWR = (workspaceId: number, channelId: number) =>
    getWithSWR<IChannel>(`/api/workspace/${workspaceId}/channels/${channelId}`);
