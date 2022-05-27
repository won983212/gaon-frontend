import { IFileNode } from '@/types';
import { useHTTPGetSWR } from './client';

export const useFilesSWR = (workspaceId: number) =>
    useHTTPGetSWR<IFileNode[]>(`/workspace/${workspaceId}/files`);
