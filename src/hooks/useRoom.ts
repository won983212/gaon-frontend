import { useParams } from 'react-router';
import { useChannelInfoSWR } from '@/api/workspace';

/**
 * 현재 들어가있는 workspace / channel 정보 얻어오기
 */
export default function useRoom() {
    const { channelId, workspaceId } = useParams();
    const channelNumId = channelId === undefined ? -1 : +channelId;
    const workspaceNumId = workspaceId === undefined ? -1 : +workspaceId;
    const { data: channelInfo } = useChannelInfoSWR(channelNumId);

    return {
        channelId: channelNumId,
        channelInfo,
        workspaceId: workspaceNumId
    };
}
