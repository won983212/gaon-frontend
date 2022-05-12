import { IFileNode } from '@/types';
import { useCommonSWR } from './client';

export const useFilesSWR = (workspaceId: number) =>
    useCommonSWR<IFileNode[]>(`/api/workspace/${workspaceId}/files`);
