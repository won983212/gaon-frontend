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
    useHTTPGetSWR<IUserSummary[]>(`/user/admin/permission/list?projectId=${workspaceId}`, {
        'x-access-token': token
    });

export const addAdmin = (
    workspaceId: number,
    newAdminUsername: string,
    userId: number,
    token: string
) =>
    post<IUserSummary>(
        `/user/admin/permission`,
        {
            userId: userId,
            projectId: workspaceId,
            newAdminUsername: newAdminUsername
        },
        { 'x-access-token': token }
    );

export const removeAdmin = (
    workspaceId: number,
    adminUserId: number,
    userId: number,
    token: string
) =>
    del(
        `/user/admin/permission?userId=${userId}&projectId=${workspaceId}&deleteAdminUserId=${adminUserId}`,
        {
            'x-access-token': token
        }
    );
