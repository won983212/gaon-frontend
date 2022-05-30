import { useParams } from 'react-router';
import { useChannelInfoSWR } from '@/api/workspace';

/**
 * 현재 들어가있는 workspace / channel 정보 얻어오기
 * channelId, workspaceId는 undefined면 -1을 기본값으로 가짐
 */
export default function useRoom() {
    const { channelId, workspaceId } = useParams();
    const { data: channelInfo } = useChannelInfoSWR(
        channelId === undefined ? -1 : +channelId
    );

    return {
        channelInfo,
        workspaceId: workspaceId === undefined ? -1 : +workspaceId
    };
}
