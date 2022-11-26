import { del, post, useHTTPGetSWR } from '@/api/client';
import { IUser, IUserSummary } from '@/types';

export const useUsersSWR = (userId: string, token: string) =>
    useHTTPGetSWR<IUser | undefined>(
        userId && token ? '/user/' + userId : undefined,
        {
            'x-access-token': token
        }
    );

export const useAdminsSWR = (workspaceId: number, token: string) =>
    useHTTPGetSWR<IUserSummary[]>(`/user/admin?workspaceId=${workspaceId}`, {
        'x-access-token': token
    });

export const addAdmin = (
    workspaceId: number,
    newAdminUsername: string,
    token: string
) =>
    post<IUserSummary>(
        '/user/admin',
        {
            workspaceId: workspaceId,
            newAdminUsername: newAdminUsername
        },
        { 'x-access-token': token }
    );

export const removeAdmin = (
    workspaceId: number,
    adminUserId: number,
    token: string
) =>
    del(
        `/user/admin?projectId=${workspaceId}&adminUserId=${adminUserId}`,
        {
            'x-access-token': token
        },
        {
            workspaceId: workspaceId,
            deleteAdminUserId: adminUserId
        }
    );
