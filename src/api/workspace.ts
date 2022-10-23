import { IChannel, IChannelGroup, IUserIdentifier, IWorkspace } from '@/types';
import { del, get, post, put, useHTTPGetSWR } from './client';

export const doInvite = () => {};

export const useInvitedProjectInfoSWR = (code: string) =>
    useHTTPGetSWR<IWorkspace>(`/invite/${code}`);

export const doAcceptInvite = (code: string, accept: boolean, token: string) =>
    get<IUserIdentifier>(`/invite/accept/${code}`, undefined, {
        accept: accept,
        'x-access-token': token
    });

export const useGroupsSWR = (workspaceId: number) => {
    const response = useHTTPGetSWR<IChannelGroup[]>(
        `/group/list/${workspaceId}`
    );
    if (workspaceId === -1) {
        response.mutate([]);
    }
    return response;
};

export const useChannelInfoSWR = (channelId: number) =>
    useHTTPGetSWR<IChannel>(`/channels/${channelId}`);

export const useWorkspacesSWR = (userId?: number) => {
    const response = useHTTPGetSWR<IWorkspace[]>(`/project/list/${userId}`);
    if (!userId) {
        response.mutate([]);
    }
    return response;
};

export const useWorkspaceSWR = (workspaceId: number) =>
    useHTTPGetSWR<IWorkspace>(`/project/${workspaceId}`);

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

export const createGroup = (
    name: string,
    projectId: number,
    createdBy: number,
    userId: number,
    token: string
) =>
    post<IChannelGroup>(
        `/group/`,
        {
            name: name,
            projectId: projectId,
            createdBy: createdBy,
            userId: userId
        },
        { 'x-access-token': token }
    );

export const deleteGroup = (groupId: number, userId: number, token: string) =>
    del(`/group/${groupId}?&userId=${userId}`, {
        'x-access-token': token
    });

export const updateGroup = (
    groupId: number,
    userId: number,
    token: string,
    new_name: string
) =>
    put(
        `/group/${groupId}`,
        {
            userId: userId,
            name: new_name
        },
        { 'x-access-token': token }
    );

export const createWorkspace = function (
    userId: number,
    name: string,
    token: string
) {
    console.log('userId', userId, 'name', name);
    return post<IWorkspace>(
        `/project/`,
        {
            userId: userId,
            name: name
        },
        { 'x-access-token': token }
    );
};

export const deleteWorkspace = (
    userId: number,
    projectId: number,
    token: string
) =>
    del(`/project/${projectId}?userId=${userId}`, {
        'x-access-token': token
    });

export const updateWorkspace = (
    userId: number,
    projectId: number,
    token: string,
    new_name?: string
) => {
    if (!new_name) return;
    return put(
        `/project/${projectId}`,
        {
            userId: userId,
            name: new_name
        },
        { 'x-access-token': token }
    );
};
