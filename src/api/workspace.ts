import { IChannel, IChannelGroup, IProject, IUserIdentifier } from '@/types';
import { get, useHTTPGetSWR } from './client';


export const useInviteProjectInfoSWR = (code: string) =>
    useHTTPGetSWR<IProject>(`/invite/${code}`);

export const doAcceptInvite = (code: string, accept: boolean, token: string) =>
    get<IUserIdentifier>(`/invite/accept/${code}`, undefined, {
        accept: accept,
        'x-access-token': token
    });

export const useChannelsSWR = (workspaceId: number) =>
    useHTTPGetSWR<IChannelGroup[]>(`/workspace/${workspaceId}/channels`);

export const useChannelInfoSWR = (channelId: number) =>
    useHTTPGetSWR<IChannel>(`/channels/${channelId}`);