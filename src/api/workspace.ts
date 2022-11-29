import { IWorkspace } from '@/types';
import { del, post, put, useHTTPGetSWR } from './client';

export const useWorkspacesSWR = (userId?: number) => {
    const response = useHTTPGetSWR<IWorkspace[]>(`/project/list/${userId}`);
    if (!userId) {
        response.mutate([]);
    }
    return response;
};

export const useWorkspaceSWR = (workspaceId: number) =>
    useHTTPGetSWR<IWorkspace>(`/project/${workspaceId}`);

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
            projectId: projectId,
            userId: userId,
            name: new_name
        },
        { 'x-access-token': token }
    );
};
