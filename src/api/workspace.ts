import { IChannelGroup } from '@/types';
import { getWithSWR } from './client';

export const getChannelsSWR = (workspaceId: number) =>
    getWithSWR<IChannelGroup[]>(`/api/workspace/${workspaceId}/channels`);
