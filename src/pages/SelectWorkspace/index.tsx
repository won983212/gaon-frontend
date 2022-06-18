import { useNavigate } from 'react-router';
import useUser from '@/hooks/useUser';
import { useWorkspacesSWR } from '@/api/workspace';
import {
    BackgroundContainer,
    BackgroundPanel,
    Title
} from '@/pages/Invite/style';
import styled from 'styled-components';
import Profile from '@/components/Profile';
import gravatar from 'gravatar';
import { useCallback } from 'react';

export const ProjectList = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
`;

export const ProjectListItem = styled.li`
    border-radius: 8px;
    box-shadow: 0 0 4px 2px lightgrey;
    margin-bottom: 8px;
    padding: 8px;
    transition: 0.2s;
    cursor: pointer;

    &:hover {
        background-color: #efefef;
    }
`;

export default function SelectWorkspace() {
    const navigate = useNavigate();
    const { user, isLoadingUser } = useUser();
    const { data, error } = useWorkspacesSWR(user?.id);

    const onClickProject = useCallback(
        (id: number) => {
            navigate(`/workspace/${id}/channel`);
        },
        [navigate]
    );

    if (error) {
        return <p>* userId가 잘못되었습니다.</p>;
    }

    if (!data || isLoadingUser) {
        return <p>Loading...</p>;
    }

    if (!user) {
        navigate('/');
        return <></>;
    }

    return (
        <BackgroundContainer>
            <BackgroundPanel style={{ height: '100%' }}>
                <Title>프로젝트 선택</Title>
                <ProjectList>
                    {data.map((workspace) => (
                        <ProjectListItem
                            key={workspace.id}
                            onClick={() => onClickProject(workspace.id)}
                        >
                            <Profile
                                username={workspace.name}
                                nameColor="black"
                                avatarUrl={gravatar.url(workspace.name, {
                                    s: '36px',
                                    d: 'retro'
                                })}
                            />
                        </ProjectListItem>
                    ))}
                </ProjectList>
            </BackgroundPanel>
        </BackgroundContainer>
    );
}
