import { get, useHTTPGetSWR } from '@/api/client';
import { IUserIdentifier, IWorkspace } from '@/types';

export const doInvite = () => {};

export const useInvitedProjectInfoSWR = (code: string) =>
    useHTTPGetSWR<IWorkspace>(`/invite/${code}`);

export const doAcceptInvite = (code: string, accept: boolean, token: string) =>
    get<IUserIdentifier>(`/invite/accept/${code}`, undefined, {
        accept: accept,
        'x-access-token': token
    });
