import { useParams } from 'react-router';
import { getChannelInfoSWR } from '@/api/workspace';

export default function useChannel() {
    const { channelId } = useParams();
    return getChannelInfoSWR(
        0, // TODO workspace id도 params로 얻어와서 설정
        channelId === undefined ? 0 : +channelId
    );
}
