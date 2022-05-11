import { IChannel, IChannelGroup } from '@/types';
import { useCommonSWR } from './client';

export const useChannelsSWR = (workspaceId: number) =>
    useCommonSWR<IChannelGroup[]>(`/api/workspace/${workspaceId}/channels`);

export const useChannelInfoSWR = (workspaceId: number, channelId: number) =>
    useCommonSWR<IChannel>(
        `/api/workspace/${workspaceId}/channels/${channelId}`
    );
