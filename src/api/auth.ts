import { IUser } from '@/types';
import { post, useCommonSWR } from './client';

// useCommonSWR 사용시, use로 시작하는 네이밍

export const useUsersSWR = () => useCommonSWR<IUser | false>('/api/user/me');

export const doLogout = () => post<'ok'>('/api/auth/logout');

export const doLogin = (email: string, password: string) =>
    post<IUser>('/api/auth/login', { email, password });

export const doSignUp = (email: string, nickname: string, password: string) =>
    post<'ok'>('/api/user', {
        email,
        nickname,
        password
    });
