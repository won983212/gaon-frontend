import { doLogout } from '@/api/auth';
import {
    createChannel,
    createGroup,
    createWorkspace,
    deleteChannel,
    deleteGroup,
    deleteWorkspace,
    updateWorkspace,
    useChannelsSWR,
    useWorkspacesSWR,
    useWorkspaceSWR
} from '@/api/workspace';
import ChannelList from '@/components/ChannelList';
import Menu from '@/components/Menu';
import Profile from '@/components/Profile';
import gravatar from 'gravatar';
import React, { useCallback, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import * as ContextMenu from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import {
    Channels,
    ConferenceMenu,
    ContentContainer,
    LogOutButton,
    MenuIconWrapper,
    MenuScroll,
    ProfileMenu,
    ProfileName,
    WorkspaceName,
    WorkspaceProfileWrapper,
    WorkspaceWrapper
} from './style';
import { MdMenu } from 'react-icons/all';
import Button from '@/components/Button';
import useRoom from '@/hooks/useRoom';
import useConferenceTabIndex from '@/hooks/useConferenceTabIndex';
import useUser from '@/hooks/useUser';
import {
    DropdownContent,
    DropdownItem,
    DropdownList
} from '@/components/Dropdown';
import Modal, { Action } from '@/components/Modal';
import { Form, Label } from '@/pages/Login/style';
import Input from '@/components/Input';

type MenuType = 'workspace' | 'user' | 'channel' | 'group';

interface WorkspaceProps {
    children: React.ReactNode;
}

interface ContextMenuInfo {
    type: MenuType;
    userId?: number;
    groupId?: number;
    workspaceId?: number;
    channelId?: number;
}

const currentContextMenuInfo: ContextMenuInfo = {
    type: 'user'
};

function Workspace({ children }: WorkspaceProps) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showWorkspaceUpdateDialog, setShowWorkspaceUpdateDialog] =
        useState(false);
    const [showChannelCreateDialog, setChannelShowCreateDialog] =
        useState(false);
    const [showWorkspaceCreateDialog, setShowWorkspaceCreateDialog] =
        useState(false);
    const [showChannelUpdateDialog, setShowChannelUpdateDialog] =
        useState(false);
    const [showGroupUpdateDialog, setShowGroupUpdateDialog] = useState(false);
    const { channelInfo, workspaceId } = useRoom();
    const { user: userData, identifier, setCookie } = useUser();
    const { data: channelCategories } = useChannelsSWR(0);
    const { mutate: setConferenceTabIndex } = useConferenceTabIndex();
    const { data: workspaceList } = useWorkspacesSWR(userData?.id);
    const { data: currentWorkspace } = useWorkspaceSWR(workspaceId);
    const navigate = useNavigate();

    const onLogout = useCallback(async () => {
        await doLogout(identifier?.token);
        setCookie(undefined);
        navigate('/');
    }, [identifier?.token, navigate, setCookie]);

    const onCloseProfileMenu = useCallback(() => {
        setShowProfileMenu(false);
    }, []);

    const onToggleProfileMenu = useCallback(() => {
        setShowProfileMenu((prev) => !prev);
    }, []);

    const onCloseWorkspaceMenu = useCallback(() => {
        setShowWorkspaceMenu(false);
    }, []);

    const onToggleWorkspaceMenu = useCallback(() => {
        setShowWorkspaceMenu((prev) => !prev);
    }, []);

    const changeWorkspace = function(workspaceId: number) {
        navigate(`/workspace/${workspaceId}/channel`);
        console.log(workspaceId);
    };

    const onShowWorkspaceContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        ContextMenu.contextMenu.show({
            id: 'workspace-context-menu',
            event: e
        });
        currentContextMenuInfo.type = 'workspace';
        currentContextMenuInfo.workspaceId = workspaceId;
        currentContextMenuInfo.userId = userData?.id;
    };

    const onShowGroupContextMenu = (e: React.MouseEvent, groupId: number) => {
        e.preventDefault();
        ContextMenu.contextMenu.show({
            id: 'group-context-menu',
            event: e,
            props: {
                groupId: groupId
            }
        });
        currentContextMenuInfo.type = 'group';
        currentContextMenuInfo.groupId = groupId;
        currentContextMenuInfo.workspaceId = workspaceId;
        currentContextMenuInfo.userId = userData?.id;
    };

    const onShowChannelContextMenu = (
        e: React.MouseEvent,
        groupId: number,
        channelId: number
    ) => {
        e.preventDefault();
        ContextMenu.contextMenu.show({ id: 'channel-context-menu', event: e });
        currentContextMenuInfo.type = 'channel';
        currentContextMenuInfo.groupId = groupId;
        currentContextMenuInfo.channelId = channelId;
        currentContextMenuInfo.workspaceId = workspaceId;
        currentContextMenuInfo.userId = userData?.id;
    };

    const onShowUserContextMenu = (e: React.MouseEvent, userId: number) => {
        e.preventDefault();
        ContextMenu.contextMenu.show({ id: 'user-context-menu', event: e });
    };

    const onCloseDeleteDialog = useCallback(
        (action: Action) => {
            try {
                if (!userData || !identifier) return;
                if (action === 'yes') {
                    switch (currentContextMenuInfo.type) {
                        case 'workspace':
                            if (
                                currentContextMenuInfo.userId &&
                                currentContextMenuInfo.workspaceId
                            ) {
                                deleteWorkspace(
                                    userData.id,
                                    currentContextMenuInfo.workspaceId,
                                    identifier.token
                                );
                            }
                            break;
                        case 'channel':
                            if (
                                currentContextMenuInfo.userId &&
                                currentContextMenuInfo.channelId &&
                                currentContextMenuInfo.groupId
                            )
                                deleteChannel(
                                    currentContextMenuInfo.userId,
                                    currentContextMenuInfo.channelId,
                                    currentContextMenuInfo.groupId,
                                    identifier.token
                                );
                            break;
                        case 'group':
                            if (
                                currentContextMenuInfo.groupId &&
                                currentContextMenuInfo.userId
                            )
                                deleteGroup(
                                    currentContextMenuInfo.groupId,
                                    currentContextMenuInfo.userId,
                                    identifier.token
                                );
                            break;
                    }
                    setShowDeleteDialog(false);
                    return;
                }
                setShowDeleteDialog(false);
                navigate(`/workspace/${workspaceId}/channel`);
            } catch (e) {
                alert(
                    '작업에 실패 했습니다. 인터넷 연결이 불안정하거나 서버에서 요청한 명령을 수행하지 못했습니다.'
                );
            }
        },
        [identifier, navigate, userData, workspaceId]
    );

    //얘는 따로따로
    const onCloseUpdateDialog = useCallback(
        (action: Action) => {
            if (!userData) return;
            if (action === 'yes') {
                switch (currentContextMenuInfo.type) {
                    case 'workspace':
                        let new_name = (
                            document.getElementById(
                                'workspace-update-name'
                            ) as HTMLInputElement
                        )?.value;
                        updateWorkspace(
                            userData?.id,
                            workspaceId,
                            identifier.token,
                            new_name ?? 'New workspace'
                        ); //에러 처리 필요
                }
                setShowWorkspaceUpdateDialog(false);
                return;
            }
            setShowWorkspaceUpdateDialog(false);
        },
        [identifier.token, navigate, userData, workspaceId]
    );

    const onCloseCreateDialog = useCallback(
        (action: Action) => {
            if (!userData) return;
            if (action === 'yes') {
                switch (currentContextMenuInfo.type) {
                    case 'workspace':
                        createWorkspace(
                            userData?.id,
                            'New workspace',
                            identifier.token
                        );
                        break;
                    case 'channel':
                        if (currentContextMenuInfo.groupId)
                            createChannel(
                                currentContextMenuInfo.groupId,
                                userData?.id,
                                'New group',
                                'chatting',
                                identifier.token
                            );
                        break;
                    case 'group':
                        if (currentContextMenuInfo.workspaceId)
                            createGroup(
                                'New group',
                                currentContextMenuInfo.workspaceId,
                                userData?.id,
                                userData?.id,
                                identifier.token
                            );
                        break;
                }
                setShowWorkspaceCreateDialog(false);
                navigate(`/workspace/${workspaceId}/channel`);
                return;
            }
            navigate(`/workspace/${workspaceId}/channel`);
            setShowWorkspaceCreateDialog(false);
        },
        [identifier.token, navigate, userData, workspaceId]
    );
    if (!userData) {
        return <Navigate replace to='/login' />;
    }

    return (
        <div>
            <WorkspaceWrapper>
                <Channels>
                    <WorkspaceName onContextMenu={onShowWorkspaceContextMenu}>
                        <WorkspaceProfileWrapper>
                            <Profile
                                username={
                                    currentWorkspace?.name ?? 'Select workspace'
                                }
                                avatarUrl={gravatar.url(
                                    currentWorkspace?.name ?? 'Select',
                                    {
                                        s: '36px',
                                        d: 'retro'
                                    }
                                )}
                                rectAvatar
                            />
                        </WorkspaceProfileWrapper>
                        <MenuIconWrapper onClick={onToggleWorkspaceMenu}>
                            <MdMenu size={16} />
                        </MenuIconWrapper>
                    </WorkspaceName>
                    {showWorkspaceMenu && (
                        <DropdownContent>
                            <DropdownList>
                                {workspaceList?.map((ws) => {
                                    return (
                                        <DropdownItem
                                            onClick={() => {
                                                onCloseWorkspaceMenu();
                                                changeWorkspace(ws.id);
                                            }}
                                        >
                                            {ws.name}
                                        </DropdownItem>
                                    );
                                })}
                            </DropdownList>
                        </DropdownContent>
                    )}
                    <MenuScroll>
                        {channelCategories?.map((category) => {
                            return (
                                <ChannelList
                                    key={category.id}
                                    name={category.name}
                                    channels={category.channels}
                                    groupId={1}
                                    onShowGroupContextMenu={function(
                                        e: React.MouseEvent
                                    ) {
                                        onShowGroupContextMenu(e, category.id);
                                        console.log(category.id);
                                    }}
                                    onShowChannelContextMenu={function(
                                        e: React.MouseEvent,
                                        channelId: number
                                    ) {
                                        onShowChannelContextMenu(
                                            e,
                                            category.id,
                                            channelId
                                        );
                                        console.log(category.id, channelId);
                                    }}
                                />
                            );
                        })}
                    </MenuScroll>
                    {showProfileMenu && (
                        <Menu
                            style={{ left: 8, bottom: 64 }}
                            onClose={onCloseProfileMenu}
                        >
                            <ProfileMenu>
                                <img
                                    src={gravatar.url(userData.username, {
                                        s: '36px',
                                        d: 'retro'
                                    })}
                                    alt={userData.username}
                                />
                                <div>
                                    <span id='profile-name'>
                                        {userData.username}
                                    </span>
                                    <span id='profile-active'>Active</span>
                                </div>
                            </ProfileMenu>
                            <LogOutButton onClick={onLogout}>
                                Logout
                            </LogOutButton>
                        </Menu>
                    )}
                    {channelInfo && channelInfo.type === 'conference' && (
                        <ConferenceMenu>
                            <Button
                                size='small'
                                style={{ flex: 1, marginRight: 8 }}
                                noPadding
                                onClick={() => setConferenceTabIndex(0)}
                            >
                                코드
                            </Button>
                            <Button
                                size='small'
                                style={{ flex: 1 }}
                                noPadding
                                onClick={() => setConferenceTabIndex(1)}
                            >
                                화이트보드
                            </Button>
                        </ConferenceMenu>
                    )}
                    <ProfileName onClick={onToggleProfileMenu}>
                        <Profile
                            username={userData.name}
                            avatarUrl={gravatar.url(userData.username, {
                                s: '36px',
                                d: 'retro'
                            })}
                            job={userData.job}
                        />
                    </ProfileName>
                </Channels>
                <ContentContainer>{children}</ContentContainer>
            </WorkspaceWrapper>
            <div>
                {/*함수의 몸체 부분에 modal에게 id를 전달하고 modal에게 api call을 위임합니다.*/}
                <ContextMenu.Menu id='workspace-context-menu'>
                    <ContextMenu.Item
                        onClick={() => {
                            setShowWorkspaceCreateDialog(true);
                        }}
                    >
                        New workspace
                    </ContextMenu.Item>
                    {workspaceId != 0 && (
                        <>
                            <ContextMenu.Item
                                onClick={({ props }) => {
                                    setShowWorkspaceUpdateDialog(true);
                                }}
                            >
                                Update
                            </ContextMenu.Item>
                            <ContextMenu.Item
                                onClick={({ props }) => {
                                    setShowDeleteDialog(true);
                                }}
                            >
                                Delete
                            </ContextMenu.Item>
                        </>
                    )}
                </ContextMenu.Menu>
                <ContextMenu.Menu id='channel-context-menu'>
                    <ContextMenu.Item onClick={() => {
                    }}>
                        New channel
                    </ContextMenu.Item>
                    <ContextMenu.Item onClick={({ props }) => {
                    }}>
                        Update
                    </ContextMenu.Item>
                    <ContextMenu.Item onClick={({ props }) => {
                    }}>
                        Delete
                    </ContextMenu.Item>
                </ContextMenu.Menu>
                <ContextMenu.Menu id='group-context-menu'>
                    <ContextMenu.Item onClick={() => {
                    }}>
                        New group
                    </ContextMenu.Item>
                    <ContextMenu.Item
                        onClick={({ props }) => {
                            setShowDeleteDialog(true);
                        }}
                    >
                        Update
                    </ContextMenu.Item>
                    <ContextMenu.Item
                        onClick={({ props }) => {
                            setShowDeleteDialog(true);
                        }}
                    >
                        Delete
                    </ContextMenu.Item>
                </ContextMenu.Menu>
                <ContextMenu.Menu id='user-context-menu'>
                    <ContextMenu.Item onClick={({ props }) => {
                    }}>
                        Kick
                    </ContextMenu.Item>
                    <ContextMenu.Item onClick={({ props }) => {
                    }}>
                        Ban
                    </ContextMenu.Item>
                </ContextMenu.Menu>
            </div>
            <div>
                {showDeleteDialog && (
                    <Modal
                        isOpen={true}
                        onAction={(action: Action) =>
                            onCloseDeleteDialog(action)
                        }
                        buttons='yesno'
                    >
                        정말로 삭제 하시겠습니까?
                    </Modal>
                )}
                {showWorkspaceCreateDialog && (
                    <Modal
                        isOpen={true}
                        onAction={onCloseCreateDialog}
                        buttons='yesno'
                    >
                        정말로 생성 하시겠습니까?
                    </Modal>
                )}
                {showWorkspaceUpdateDialog && (
                    <Modal
                        isOpen={true}
                        onAction={onCloseUpdateDialog}
                        buttons='yesno'
                    >
                        <Form>
                            <Label>새 워크스페이스 이름</Label>
                            <Input id='workspace-update-name'></Input>
                        </Form>
                    </Modal>
                )}
                {showChannelUpdateDialog && (
                    <Modal
                        isOpen={true}
                        onAction={onCloseUpdateDialog}
                        buttons='yesno'
                    >
                        <Form>
                            <Label>새 채널 이름</Label>
                            <Input id='channel-update-name'></Input>
                        </Form>
                    </Modal>
                )}
                {showGroupUpdateDialog && (
                    <Modal
                        isOpen={true}
                        onAction={onCloseUpdateDialog}
                        buttons='yesno'
                    >
                        <Form>
                            <Label>새 그룹 이름</Label>
                            <Input id='group-update-name'></Input>
                        </Form>
                    </Modal>
                )}
            </div>
        </div>
    );
}

export default Workspace;
