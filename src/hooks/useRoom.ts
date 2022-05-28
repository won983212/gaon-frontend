import { useParams } from 'react-router';
import { useChannelInfoSWR } from '@/api/workspace';
import useSWR from 'swr';

/**
 * 현재 들어가있는 workspace / channel 정보 얻어오기
 */
let workspaceIdStore = 0;
export default function useRoom() {
    const { channelId } = useParams();
    const { data: workspaceId, mutate: mutateWorkspaceId } = useSWR<number>(
        'workspaceId',
        () => {
            return workspaceIdStore;
        }
    );
    const { data: channelInfo } = useChannelInfoSWR(
        channelId === undefined ? 0 : +channelId
    );

    return {
        channelInfo,
        workspaceId,
        setWorkspaceId: (workspace: number) => {
            workspaceIdStore = workspace;
            return mutateWorkspaceId();
        }
    };
}
