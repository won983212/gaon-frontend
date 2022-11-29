import { useNavigate, useParams } from 'react-router';
import Button from '@/components/Button';
import { useCallback } from 'react';
import useUser from '@/hooks/useUser';
import Login from '@/pages/Login';
import {
    ActionPanel,
    BackgroundContainer,
    BackgroundPanel,
    Content,
    ContentPanel,
    ProjectNameMark,
    Title
} from '@/pages/Invite/style';
import { doAcceptInvite, useInvitedProjectInfoSWR } from '@/api/invite';

export default function Invite() {
    const navigate = useNavigate();
    const { inviteId } = useParams();
    const { user, isLoadingUser, identifier } = useUser();
    const { data, error } = useInvitedProjectInfoSWR(inviteId ?? '');

    const onAccept = useCallback(() => {
        if (inviteId) {
            doAcceptInvite(inviteId, true, identifier.id, identifier.token)
                .catch(() => alert('에러가 발생했습니다.'))
                .then(() => navigate(`/workspace/${data?.id}/channel`));
        }
    }, [data?.id, identifier.id, identifier.token, inviteId, navigate]);

    const onDecline = useCallback(() => {
        if (inviteId) {
            doAcceptInvite(inviteId, false, identifier.id, identifier.token)
                .catch(() => alert('에러가 발생했습니다.'))
                .then(() => navigate('/'));
        }
    }, [identifier.id, identifier.token, inviteId, navigate]);

    if (!inviteId || error) {
        return <p>* inviteId가 잘못되었습니다.</p>;
    }

    if (!data || isLoadingUser) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <Login redirectTo={`/invite/${inviteId}`} />;
    }

    return (
        <BackgroundContainer>
            <BackgroundPanel>
                <ContentPanel>
                    <Title>초대 메시지</Title>
                    <Content>
                        귀하는 <ProjectNameMark>{data.name}</ProjectNameMark>{' '}
                        프로젝트의 초대를 받았습니다. 함께하시려면 수락을
                        누르세요.
                    </Content>
                </ContentPanel>
                <ActionPanel>
                    <Button
                        fullWidth
                        style={{ marginRight: '16px' }}
                        onClick={onDecline}
                    >
                        거절
                    </Button>
                    <Button fullWidth color="dodgerblue" onClick={onAccept}>
                        수락
                    </Button>
                </ActionPanel>
            </BackgroundPanel>
        </BackgroundContainer>
    );
}
