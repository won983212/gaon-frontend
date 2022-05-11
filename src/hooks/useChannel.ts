import { useParams } from 'react-router';
import { useChannelInfoSWR } from '@/api/workspace';

/**
 * 현재 들어가있는 channel 정보 얻어오기
 */
export default function useChannel() {
    const { channelId } = useParams();
    return useChannelInfoSWR(
        0, // TODO workspace id도 params로 얻어와서 설정
        channelId === undefined ? 0 : +channelId
    );
}
