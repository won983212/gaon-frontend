import { IUser } from '@/types';
import { getWithSWR, post } from './client';

export const getUsersSWR = () => getWithSWR<IUser | false>('/api/user/me');

export const doLogout = () => post<'ok'>('/api/auth/logout');

export const doLogin = (email: string, password: string) =>
    post<IUser>('/api/auth/login', { email, password });

export const doSignUp = (email: string, nickname: string, password: string) =>
    post<'ok'>('/api/user', {
        email,
        nickname,
        password
    });
