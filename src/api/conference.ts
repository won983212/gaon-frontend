import { IFileNode } from '@/types';
import { apiUrl, useHTTPGetSWR } from './client';

export const useFilesSWR = (workspaceId: number) =>
    useHTTPGetSWR<IFileNode[]>(apiUrl(`/workspace/${workspaceId}/files`));
