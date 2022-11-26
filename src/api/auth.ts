import { IUserIdentifier } from '@/types';
import { post } from './client';

export const doLogout = (token: string) =>
    post(token && '/auth/logout', {}, { 'x-access-token': token });

export const doLogin = (username: string, password: string) =>
    post<IUserIdentifier>('/auth/login', {
        userId: username,
        password: password
    });

export const doSignUp = (
    id: string,
    password: string,
    nickname: string,
    email: string,
    name?: string,
    birth?: number
) =>
    post('/user', {
        userId: id,
        username: nickname,
        password,
        email,
        name,
        birth
    });
