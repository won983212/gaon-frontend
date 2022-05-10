import { IChannel, IChannelGroup } from '@/types';
import { useCommonSWR } from './client';

export const getChannelsSWR = (workspaceId: number) =>
    useCommonSWR<IChannelGroup[]>(`/api/workspace/${workspaceId}/channels`);

export const getChannelInfoSWR = (workspaceId: number, channelId: number) =>
    useCommonSWR<IChannel>(
        `/api/workspace/${workspaceId}/channels/${channelId}`
    );
