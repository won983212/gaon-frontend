import { get, post, useHTTPGetSWR } from '@/api/client';
import { IProjectInvite, IWorkspace } from '@/types';

export const doInvite = (
    userToInvite: string,
    projectId: number,
    userId: number,
    token: string
) =>
    post<IProjectInvite>(
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

export const doAcceptInvite = (code: string, accept: boolean, userId: number, token: string) =>
    get(`/invite/accept/${code}?userId=${userId}`, undefined, {
        accept: accept,
        'x-access-token': token
    });
