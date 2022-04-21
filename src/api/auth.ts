import { IUser } from '@/types';
import { getWithSWR, post } from './client';

export const getUsersSWR = () => getWithSWR<IUser>('/api/users');

export const doLogout = () => post<'ok'>('/api/users/logout');

export const doLogin = (email: string, password: string) =>
    post<IUser>('/api/users/login', { email, password });

export const doSignUp = (email: string, nickname: string, password: string) =>
    post<'ok'>('/api/users', {
        email,
        nickname,
        password
    });
