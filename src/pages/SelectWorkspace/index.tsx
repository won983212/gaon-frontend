import { Navigate, useNavigate } from 'react-router';
import useUser from '@/hooks/useUser';
import { createWorkspace, useWorkspacesSWR } from '@/api/workspace';
import {
    BackgroundContainer,
    BackgroundPanel,
    Title
} from '@/pages/Invite/style';
import styled from 'styled-components';
import Profile from '@/components/Profile';
import gravatar from 'gravatar';
import React, { useCallback, useEffect, useState } from 'react';
import Modal, { Action } from '@/components/Modal';
import Input from '@/components/Input';
import useInput from '@/hooks/useInput';

export const ProjectList = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
`;

export const ProjectCreate = styled.div`
    user-select: none;
    padding: 4px;
    text-align: center;
    border-radius: 4px;
    color: var(--primary-lighter);

    &:hover {
        background-color: #efefef;
    }
`;

export const Error = styled.div`
    color: #e01e5a;
    margin: 8px 0 16px;
    font-weight: bold;
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
    const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
    const [dialogError, setDialogError] = useState('');
    const { user, identifier, isLoadingUser } = useUser();
    const { data, mutate, error } = useWorkspacesSWR(user?.id);
    const [projectName, onChangeProjectName, setProjectName] = useInput('');

    const onClickProject = useCallback(
        (id: number) => {
            navigate(`/workspace/${id}/channel`);
        },
        [navigate]
    );

    const onClickNewProject = useCallback(() => {
        setShowNewProjectDialog(true);
    }, []);

    const onCloseNewProjectDialog = useCallback(
        (action: Action) => {
            if (action === 'ok' && user && identifier) {
                if (!projectName) {
                    setDialogError('프로젝트 이름을 입력해주세요.');
                } else {
                    createWorkspace(
                        user.id,
                        projectName,
                        identifier.token
                    ).then(() => mutate());
                    setShowNewProjectDialog(false);
                    setDialogError('');
                }
            } else {
                setShowNewProjectDialog(false);
                setDialogError('');
            }
            setProjectName('')
        },
        [identifier, mutate, projectName, setProjectName, user]
    );

    useEffect(() => {
        mutate()
    }, [mutate])

    if (!data || isLoadingUser) {
        return <p>Loading...</p>;
    }

    if (!user || error) {
        return <Navigate replace to="/" />;
    }

    if (showNewProjectDialog) {
        return (
            <Modal
                isOpen={true}
                onAction={onCloseNewProjectDialog}
                buttons="okcancel"
            >
                <b>새로 만들 프로젝트 이름을 입력해주세요.</b>
                {dialogError && <Error>{dialogError}</Error>}
                <Input
                    type="text"
                    id="projectName"
                    name="projectName"
                    value={projectName}
                    style={{ marginTop: '16px', marginBottom: '4px' }}
                    onChange={onChangeProjectName}
                />
            </Modal>
        );
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
                                nameColor="var(--primary)"
                                avatarUrl={gravatar.url(workspace.name, {
                                    s: '36px',
                                    d: 'retro'
                                })}
                            />
                        </ProjectListItem>
                    ))}
                </ProjectList>
                <ProjectCreate onClick={onClickNewProject}>
                    + 프로젝트 추가
                </ProjectCreate>
            </BackgroundPanel>
        </BackgroundContainer>
    );
}
