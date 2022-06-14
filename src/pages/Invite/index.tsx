import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import Button from '@/components/Button';
import { doAcceptInvite, useInviteProjectInfoSWR } from '@/api/workspace';
import { useCallback } from 'react';
import useUser from '@/hooks/useUser';

const BackgroundContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BackgroundPanel = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  margin-top: 172px;
  width: 400px;
  height: 300px;
  padding: 16px;
  box-shadow: 0 0 16px 4px lightgrey;
`;

const ContentPanel = styled.div`
  flex: 1;
`;

const ActionPanel = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Title = styled.h2`
  text-align: center;
`;

const Content = styled.p`
  color: var(--text);
`;

const ProjectNameMark = styled.span`
  background-color: lightgoldenrodyellow;
  font-weight: bold;
`;

export default function Invite() {
    const navigate = useNavigate();
    const { inviteId } = useParams();
    const { user, isLoadingUser, identifier } = useUser();
    const { data, error } = useInviteProjectInfoSWR(inviteId ? inviteId : '');

    const onAccept = useCallback(() => {
        if (inviteId) {
            doAcceptInvite(inviteId, true, identifier.token)
                .catch(() => alert('에러가 발생했습니다.'))
                .then(() => navigate(`/workspace/${data?.id}/channel`));
        }
    }, [data?.id, identifier?.token, inviteId, navigate]);

    const onDecline = useCallback(() => {
        if (inviteId) {
            doAcceptInvite(inviteId, false, identifier.token)
                .catch(() => alert('에러가 발생했습니다.'))
                .then(() => navigate('/'));
        }
    }, [identifier?.token, inviteId, navigate]);

    if (!inviteId || error) {
        return <p>* inviteId가 잘못되었습니다.</p>;
    }

    if (!data || isLoadingUser) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <p>로그인 정보가 잘못되었습니다.</p>;
    }

    return (
        <BackgroundContainer>
            <BackgroundPanel>
                <ContentPanel>
                    <Title>초대 메시지</Title>
                    <Content>
                        귀하는 <ProjectNameMark>{data.name}</ProjectNameMark> 프로젝트의
                        초대를 받았습니다. 함께하시려면
                        수락을 누르세요.
                    </Content>
                </ContentPanel>
                <ActionPanel>
                    <Button fullWidth style={{ marginRight: '16px' }}
                            onClick={onDecline}>
                        거절
                    </Button>
                    <Button fullWidth color='dodgerblue' onClick={onAccept}>
                        수락
                    </Button>
                </ActionPanel>
            </BackgroundPanel>
        </BackgroundContainer>
    );
}
