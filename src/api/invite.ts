import { get, post, useHTTPGetSWR } from '@/api/client';
import { IUserIdentifier, IWorkspace } from '@/types';

export const doInvite = (
    userToInvite: string,
    projectId: number,
    userId: number,
    token: string
) =>
    post(
        `/invite`,
        {
            userId: userId,
            projectId: projectId,
            userToInvite: userToInvite
        },
        { 'x-access-token': token }
    );

export const useInvitedProjectInfoSWR = (code: string) =>
    useHTTPGetSWR<IWorkspace>(`/invite/${code}`);

export const doAcceptInvite = (code: string, accept: boolean, token: string) =>
    get<IUserIdentifier>(`/invite/accept/${code}`, undefined, {
        accept: accept,
        'x-access-token': token
    });
