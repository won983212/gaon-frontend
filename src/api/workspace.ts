import { IChannel, IChannelGroup } from '@/types';
import { apiUrl, useHTTPGetSWR } from './client';

export const useChannelsSWR = (workspaceId: number) =>
    useHTTPGetSWR<IChannelGroup[]>(
        apiUrl(`/workspace/${workspaceId}/channels`)
    );

export const useChannelInfoSWR = (workspaceId: number, channelId: number) =>
    useHTTPGetSWR<IChannel>(
        apiUrl(`/workspace/${workspaceId}/channels/${channelId}`)
    );
