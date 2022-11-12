import { del, post, useHTTPGetSWR } from '@/api/client';
import { IUser, IUserSummary } from '@/types';

export const useUsersSWR = (userId: string, token: string) =>
    useHTTPGetSWR<IUser | undefined>(
        userId && token ? '/user/' + userId : undefined,
        {
            'x-access-token': token
        }
    );

export const useAdminsSWR = (token: string) =>
    useHTTPGetSWR<IUserSummary[]>('/user/admin', {
        'x-access-token': token
    });

export interface IAdminRequest {
    id: number;
}

export const addAdmin = (newAdminUserId: number, token: string) =>
    post<IAdminRequest>(
        '/user/admin',
        {
            id: newAdminUserId
        },
        { 'x-access-token': token }
    );

export const removeAdmin = (adminUserId: number, token: string) =>
    del<IAdminRequest>(`/user/admin?id=${adminUserId}`, {
        'x-access-token': token
    });
