import { useHTTPGetSWR } from '@/api/client';
import { IUser } from '@/types';

export const useUsersSWR = (userId: string, token: string) =>
    useHTTPGetSWR<IUser | undefined>(
        userId && token ? '/user/' + userId : undefined,
        {
            'x-access-token': token
        }
    );
