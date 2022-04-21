import { IChannelCategory } from '@/types';
import { getWithSWR } from './client';

export const getChannelsSWR = (workspaceId: number) =>
    getWithSWR<IChannelCategory[]>(`/api/workspace/${workspaceId}/channels`);
