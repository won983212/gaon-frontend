import {
    IChannel,
    IChannelGroup,
    IProject,
    IUserIdentifier,
    IWorkspace
} from '@/types';
import axios from 'axios';
import { del, get, post, put, useHTTPGetSWR } from './client';

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

export const useWorkspacesSWR = (userId?: number) =>
    useHTTPGetSWR<IWorkspace[]>(`/project/list/${userId}`);

export const useWorkspaceSWR = (workspaceId: number) =>
    useHTTPGetSWR<IWorkspace>(`/project/${workspaceId}`);

export const createChannel = (
    groupId: number,
    userId: number,
    name: string,
    type: string,
    token: string
) => {
    post(
        `/channel/`,
        {
            groupId: groupId,
            userId: userId,
            name: name,
            type: type
        },
        { 'x-access-token': token }
    );
};

export const deleteChannel = (
    userId: number,
    channelId: number,
    groupId: number,
    token: string
) => {
    axios.delete(`/channel/${channelId}?userId=${userId}&groupId=${groupId}`, {
        headers: {
            'x-access-token': token
        }
    });
};

export const updateChannel = (
    userId: number,
    channelId: number,
    groupId: number,
    token: string,
    new_name?: string,
    new_type?: string
) => {
    if (!(new_type || new_name))
        axios.put(
            `/channel/${channelId}`,
            {
                userId: userId,
                groupId: groupId,
                name: new_name,
                type: new_type
            },
            { headers: { 'x-access-token': token } }
        );
};

export const createGroup = (
    name: string,
    projectId: number,
    createdBy: number,
    userId: number,
    token: string
) => {
    post(
        `/group/`,
        {
            name: name,
            projectId: projectId,
            createdBy: createdBy,
            userId: userId
        },
        { 'x-access-token': token }
    );
};

export const deleteGroup = (groupId: number, userId: number, token: string) => {
    axios.delete(`/api/group/${groupId}?&userId=${userId}`, {
        headers: {
            'x-access-token': token
        }
    });
};

export const updateGroup = (
    groupId: number,
    userId: number,
    token: string,
    new_name?: string
) => {
    if (!new_name) return;
    axios.put(
        `/api/group/${groupId}`,
        {
            userId: userId,
            name: new_name
        },
        { headers: { 'x-access-token': token } }
    );
};

export const createWorkspace = function (
    userId: number,
    name: string,
    token: string
) {
    console.log('userId', userId, 'name', name);
    post(
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
    put(
        `/project/${projectId}`,
        {
            userId: userId,
            name: new_name
        },
        { 'x-access-token': token }
    );
};

export const getChannelList = (groupId: number) =>
    useHTTPGetSWR<IChannel[]>(`/channel/list/${groupId}`);
