import { del, post, put, useHTTPGetSWR } from '@/api/client';
import { IChannelGroup } from '@/types';

export const useGroupsSWR = (workspaceId: number) => {
    const response = useHTTPGetSWR<IChannelGroup[]>(
        `/group/list/${workspaceId}`
    );
    if (workspaceId === -1) {
        response.mutate([]);
    }
    return response;
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

export const deleteGroup = (projectId: number, groupId: number, userId: number, token: string) =>
    del(`/group/${groupId}?&userId=${userId}&projectId=${projectId}`, {
        'x-access-token': token
    });

export const updateGroup = (
    projectId: number,
    groupId: number,
    userId: number,
    token: string,
    new_name: string
) =>
    put(
        `/group/${groupId}`,
        {
            projectId: projectId,
            userId: userId,
            name: new_name
        },
        { 'x-access-token': token }
    );
