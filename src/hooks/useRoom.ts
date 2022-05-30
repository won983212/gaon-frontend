import { useParams } from 'react-router';
import { useChannelInfoSWR } from '@/api/workspace';

/**
 * 현재 들어가있는 workspace / channel 정보 얻어오기
 */
export default function useRoom() {
    const { channelId, workspaceId } = useParams();
    const { data: channelInfo } = useChannelInfoSWR(
        channelId === undefined ? 0 : +channelId
    );

    return {
        channelInfo,
        workspaceId
    };
}
