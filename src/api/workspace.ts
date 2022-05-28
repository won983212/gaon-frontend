import { IChannel, IChannelGroup } from '@/types';
import { useHTTPGetSWR } from './client';

export const useChannelsSWR = (workspaceId: number) =>
    useHTTPGetSWR<IChannelGroup[]>(`/workspace/${workspaceId}/channels`);

export const useChannelInfoSWR = (channelId: number) =>
    useHTTPGetSWR<IChannel>(`/channels/${channelId}`);
