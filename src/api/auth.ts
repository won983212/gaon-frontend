import { IUser, IUserIdentifier } from '@/types';
import { apiUrl, post, useHTTPGetSWR } from './client';

export const useUsersSWR = (userId: string, token: string) =>
    useHTTPGetSWR<IUser | undefined>(
        userId && token ? apiUrl('/user/' + userId) : undefined,
        {
            token: token
        }
    );

export const doLogout = (token: string) =>
    post<'ok'>(
        token && apiUrl('/auth/logout'),
        {},
        { 'x-access-token': token }
    );

export const doLogin = (username: string, password: string) =>
    post<IUserIdentifier>(apiUrl('/auth/login'), {
        userId: username,
        password
    });

export const doSignUp = (
    id: string,
    password: string,
    nickname: string,
    email: string,
    name?: string,
    birth?: number
) =>
    post<'ok'>(apiUrl('/user'), {
        userId: id,
        username: nickname,
        password,
        email,
        name,
        birth
    });
