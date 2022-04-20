import { getWithSWR, post } from './client';

export const getUsersSWR = () => getWithSWR<UsersResponse>('/api/users');

export type UsersResponse = {
    nickname: string;
    email: string;
    id: number;
};

export const doLogout = () => post<void>('/api/users/logout');

export const doLogin = (email: string, password: string) =>
    post<UsersResponse>('/api/users/login', { email, password });

export const doSignUp = (email: string, nickname: string, password: string) =>
    post<string>('/api/users', {
        email,
        nickname,
        password
    });
