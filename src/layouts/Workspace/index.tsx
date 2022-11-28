import { doLogout } from '@/api/auth';
import {
    createWorkspace,
    deleteWorkspace,
    updateWorkspace,
    useWorkspacesSWR,
    useWorkspaceSWR
} from '@/api/workspace';
import ChannelList from '@/components/ChannelList';
import Menu from '@/components/Menu';
import Profile from '@/components/Profile';
import gravatar from 'gravatar';
import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import * as ContextMenu from 'react-contexify';
import { useContextMenu } from 'react-contexify';
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
import useInput from '@/hooks/useInput';
import { ChannelType, IChannel } from '@/types';
import {
    createGroup,
    deleteGroup,
    updateGroup,
    useGroupsSWR
} from '@/api/group';
import {
    createChannel,
    deleteChannel,
    getChannels,
    updateChannel
} from '@/api/channel';
import { doInvite } from '@/api/invite';
import UserPermissionModal from '@/pages/Workspace/UserPermissionModal';
import useSocket from '@/hooks/useSocket';
import { SerializedDrawElement } from '@/components/Whiteboard/types';
import { getDeserializer } from '@/components/Whiteboard/registry';

type CommandTarget = 'workspace' | 'channel' | 'group';

interface CommandContext {
    target: CommandTarget;
    groupId?: number;
    channelId?: number;
}

interface WorkspaceProps {
    children: React.ReactNode;
}

function Workspace({ children }: WorkspaceProps) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showInviteDialog, setShowInviteDialog] = useState(false);
    const [showCodeDialog, setShowCodeDialog] = useState(false);
    const [showPermissionDialog, setShowPermissionDialog] = useState(false);

    const [inviteCode, setInviteCode] = useState<number | undefined>();

    const { show: showWorkspaceContextMenu } = useContextMenu({
        id: 'workspace-context-menu'
    });
    const { show: showGroupContextMenu } = useContextMenu({
        id: 'group-context-menu'
    });
    const { show: showChannelContextMenu } = useContextMenu({
        id: 'channel-context-menu'
    });

    const [channels, setChannels] = useState<Map<number, IChannel[]>>(
        new Map()
    );
    const [commandContext, setCommandContext] = useState<CommandContext>({
        target: 'workspace'
    });
    const [inputText, onChangedInputText, setInputText] = useInput('');

    const { channelInfo, workspaceId, channelId } = useRoom();
    const [socket] = useSocket(workspaceId, 'voice')
    const { user: userData, identifier, setCookie } = useUser();
    const { data: channelGroups, mutate: mutateChannelGroups } =
        useGroupsSWR(workspaceId);
    const { mutate: setConferenceTabIndex } = useConferenceTabIndex();
    const { data: workspaceList } = useWorkspacesSWR(userData?.id);
    const { data: currentWorkspace, mutate: mutateWorkspace } =
        useWorkspaceSWR(workspaceId);
    const navigate = useNavigate();


    const onLogout = useCallback(async () => {
        await doLogout(identifier.id, identifier?.token);
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

    const changeWorkspace = function (workspaceId: number) {
        navigate(`/workspace/${workspaceId}/channel`);
    };

    const onShowWorkspaceContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        showWorkspaceContextMenu(e);
    };

    const onShowGroupContextMenu = (e: React.MouseEvent, groupId: number) => {
        e.preventDefault();
        showGroupContextMenu(e, {
            props: {
                groupId: groupId
            }
        });
    };

    const onShowChannelContextMenu = (
        e: React.MouseEvent,
        groupId: number,
        channelId: number
    ) => {
        e.preventDefault();
        showChannelContextMenu(e, {
            props: {
                groupId: groupId,
                channelId: channelId
            }
        });
    };

    const onCloseInviteDialog = (action: Action) => {
        if (!userData || !identifier) return;
        if (action === 'ok') {
            let name = inputText?.trim();
            if (!name) {
                alert('이름을 입력해주세요.');
                return;
            }
            doInvite(name, workspaceId, userData.id, identifier.token)
                .then(() => {
                    alert('초대 메시지를 보냈습니다.');
                })
                .catch(() => {
                    alert('초대할 수 없습니다.');
                });
            setInputText('');
        }
        setShowInviteDialog(false);
    };

    const onCloseCodeDialog = () => {
        setShowCodeDialog(false);
    };

    const onCloseDeleteDialog = (action: Action) => {
        if (!userData || !identifier) return;
        if (action === 'yes') {
            switch (commandContext.target) {
                case 'workspace':
                    if (userData.id) {
                        deleteWorkspace(
                            userData.id,
                            workspaceId,
                            identifier.token
                        )
                            .then(() => {
                                navigate(`/`);
                            })
                            .catch(() => {
                                alert('삭제하지 못했습니다.');
                            });
                    }
                    break;
                case 'channel':
                    if (
                        userData.id &&
                        commandContext?.channelId &&
                        commandContext?.groupId
                    ) {
                        const groupId = commandContext.groupId as number;
                        const channelId = commandContext.channelId as number;
                        deleteChannel(
                            workspaceId,
                            userData.id,
                            commandContext.channelId,
                            commandContext.groupId,
                            identifier.token
                        )
                            .then(() => {
                                setChannels((prev) => {
                                    const prevChannels = prev.get(groupId);
                                    if (prevChannels) {
                                        return new Map(prev).set(
                                            groupId,
                                            prevChannels.filter(
                                                (value) =>
                                                    value.id !== channelId
                                            )
                                        );
                                    } else {
                                        return prev;
                                    }
                                });
                                navigate(`/workspace/${workspaceId}/channel`);
                            })
                            .catch(() => {
                                alert('삭제하지 못했습니다.');
                            });
                    }
                    break;
                case 'group':
                    if (commandContext.groupId && userData.id) {
                        deleteGroup(
                            workspaceId,
                            commandContext.groupId,
                            userData.id,
                            identifier.token
                        )
                            .then(() => {
                                mutateChannelGroups((prev) =>
                                    prev?.filter(
                                        (value) =>
                                            value.id !== commandContext.groupId
                                    )
                                );
                                navigate(`/workspace/${workspaceId}/channel`);
                            })
                            .catch(() => {
                                alert('삭제하지 못했습니다.');
                            });
                    }
                    break;
            }
        }
        setShowDeleteDialog(false);
    };

    //얘는 따로따로
    const onCloseUpdateDialog = (action: Action) => {
        if (!userData) return;

        if (action === 'ok') {
            let name = inputText?.trim();
            if (!name) {
                alert('이름을 입력해주세요.');
                return;
            }

            switch (commandContext.target) {
                case 'workspace':
                    updateWorkspace(
                        userData?.id,
                        workspaceId,
                        identifier.token,
                        name
                    )
                        ?.then(() => {
                            if (currentWorkspace) {
                                mutateWorkspace({
                                    ...currentWorkspace,
                                    name: name
                                });
                            }
                        })
                        .catch(() => {
                            alert('수정하지 못했습니다.');
                        });
                    break;
                case 'group':
                    if (commandContext.groupId) {
                        updateGroup(
                            workspaceId,
                            commandContext.groupId,
                            userData?.id,
                            identifier.token,
                            name
                        )
                            ?.then(() => {
                                mutateChannelGroups((prev) =>
                                    prev?.map((value) =>
                                        value.id === commandContext.groupId
                                            ? {
                                                  ...value,
                                                  name: name
                                              }
                                            : value
                                    )
                                );
                            })
                            .catch(() => {
                                alert('수정하지 못했습니다.');
                            });
                    }
                    break;
                case 'channel':
                    if (commandContext.channelId && commandContext.groupId) {
                        const groupId = commandContext.groupId as number;
                        const channelId = commandContext.channelId as number;
                        updateChannel(
                            workspaceId,
                            userData.id,
                            commandContext.channelId,
                            commandContext.groupId,
                            identifier.token,
                            name
                        )
                            .then(() => {
                                setChannels((prev) => {
                                    const prevChannels = prev.get(groupId);
                                    if (prevChannels) {
                                        return new Map(prev).set(
                                            groupId,
                                            prevChannels.map((value) =>
                                                value.id === channelId
                                                    ? {
                                                          ...value,
                                                          name: name
                                                      }
                                                    : value
                                            )
                                        );
                                    } else {
                                        return prev;
                                    }
                                });
                            })
                            .catch(() => {
                                alert('수정하지 못했습니다.');
                            });
                    }
                    break;
            }
        }
        setShowUpdateDialog(false);
        setInputText('');
    };

    const onCloseCreateDialog = (action: Action) => {
        if (!userData) return;

        if (action === 'ok') {
            let name = inputText?.trim();
            if (!name) {
                alert('이름을 입력해주세요.');
                return;
            }

            switch (commandContext.target) {
                case 'workspace':
                    createWorkspace(userData?.id, name, identifier.token)
                        .then((response) => {
                            navigate(`/workspace/${response.data.id}/channel`);
                        })
                        .catch(() => {
                            alert('생성하지 못했습니다.');
                        });
                    break;
                case 'channel':
                    if (commandContext.groupId) {
                        const groupId = commandContext.groupId as number;
                        createChannel(
                            workspaceId,
                            groupId,
                            userData?.id,
                            name,
                            'chatting',
                            identifier.token
                        )
                            .then((response) => {
                                setChannels((prev) => {
                                    const prevChannels = prev.get(groupId);
                                    if (prevChannels) {
                                        return new Map(prev).set(
                                            groupId,
                                            prevChannels.concat({
                                                id: response.data.id,
                                                name: name,
                                                type: response.data.type
                                            })
                                        );
                                    } else {
                                        return prev;
                                    }
                                });
                            })
                            .catch(() => {
                                alert('생성하지 못했습니다.');
                            });
                    }
                    break;
                case 'group':
                    if (workspaceId) {
                        createGroup(
                            name,
                            workspaceId,
                            userData?.id,
                            userData?.id,
                            identifier.token
                        )
                            .then((response) => {
                                mutateChannelGroups((prev) =>
                                    prev?.concat({
                                        id: response.data.id,
                                        name: name
                                    })
                                );
                            })
                            .catch(() => {
                                alert('생성하지 못했습니다.');
                            });
                    }
                    break;
            }
        }
        setShowCreateDialog(false);
        setInputText('');
    };

    const setChannelType = (
        channelId: number,
        groupId: number,
        type: ChannelType
    ) => {
        if (type === 'empty' || !userData) {
            return;
        }

        updateChannel(
            workspaceId,
            userData.id,
            channelId,
            groupId,
            identifier.token,
            undefined,
            type
        )
            .then(() => {
                setChannels((prev) => {
                    const prevChannels = prev.get(groupId);
                    if (prevChannels) {
                        return new Map(prev).set(
                            groupId,
                            prevChannels.map((value) =>
                                value.id === channelId
                                    ? {
                                          ...value,
                                          type: type
                                      }
                                    : value
                            )
                        );
                    } else {
                        return prev;
                    }
                });
            })
            .catch(() => {
                alert('수정하지 못했습니다.');
            });
    };

    const cacheChannelList = (groupId: number) => {
        getChannels(groupId).then((response) => {
            setChannels((prev) => new Map(prev).set(groupId, response.data));
        });
    };

    const onShowCodeDialog = useCallback(() => {
        socket.emit("invitePhone", channelId, userData?.id, identifier.token, (result: number) => {
            if(result > 0) {
                setInviteCode(result)
            } else {
                console.error("Can't generate invite code.")
            }
        });
        setShowCodeDialog(true)
    }, [channelId, identifier.token, socket, userData?.id]);

    if (!userData) {
        return <Navigate replace to="/login" />;
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
                                            key={ws.id}
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
                        {channelGroups?.map((category) => {
                            return (
                                <ChannelList
                                    key={category.id}
                                    name={category.name}
                                    channels={channels.get(category.id) ?? []}
                                    groupId={category.id}
                                    onShowGroupContextMenu={(
                                        e: React.MouseEvent
                                    ) => onShowGroupContextMenu(e, category.id)}
                                    onShowChannelContextMenu={(
                                        e: React.MouseEvent,
                                        channelId: number
                                    ) =>
                                        onShowChannelContextMenu(
                                            e,
                                            category.id,
                                            channelId
                                        )
                                    }
                                    onNeedChannelList={(groupId) => {
                                        cacheChannelList(groupId);
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
                                    <span id="profile-name">
                                        {userData.username}
                                    </span>
                                    <span id="profile-active">Active</span>
                                </div>
                            </ProfileMenu>
                            <LogOutButton onClick={onLogout}>
                                Logout
                            </LogOutButton>
                        </Menu>
                    )}
                    {channelInfo && channelInfo.type === 'conference' && (
                        <div>
                            <ConferenceMenu>
                                <Button
                                    size="small"
                                    style={{ flex: 1, marginRight: 8 }}
                                    noPadding
                                    onClick={() => setConferenceTabIndex(0)}
                                >
                                    코드
                                </Button>
                                <Button
                                    size="small"
                                    style={{ flex: 1 }}
                                    noPadding
                                    onClick={() => setConferenceTabIndex(1)}
                                >
                                    화이트보드
                                </Button>
                            </ConferenceMenu>
                            <ConferenceMenu>
                                <Button
                                    size="small"
                                    style={{ flex: 1 }}
                                    noPadding
                                    onClick={onShowCodeDialog}
                                >
                                    휴대폰 연결
                                </Button>
                            </ConferenceMenu>
                        </div>
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
                <ContextMenu.Menu id="workspace-context-menu">
                    <ContextMenu.Item
                        onClick={() => {
                            setShowInviteDialog(true);
                        }}
                    >
                        사용자 초대
                    </ContextMenu.Item>
                    <ContextMenu.Item
                        onClick={() => {
                            setShowPermissionDialog(true);
                        }}
                    >
                        어드민 유저 설정
                    </ContextMenu.Item>
                    <ContextMenu.Item
                        onClick={() => {
                            setShowCreateDialog(true);
                            setCommandContext({
                                target: 'workspace'
                            });
                        }}
                    >
                        새 워크스페이스 만들기
                    </ContextMenu.Item>
                    <ContextMenu.Item
                        onClick={() => {
                            setShowCreateDialog(true);
                            setCommandContext({
                                target: 'group'
                            });
                        }}
                    >
                        새 그룹 만들기
                    </ContextMenu.Item>
                    <ContextMenu.Item
                        onClick={() => {
                            setShowUpdateDialog(true);
                            setCommandContext({
                                target: 'workspace'
                            });
                        }}
                    >
                        이름 변경
                    </ContextMenu.Item>
                    <ContextMenu.Item
                        onClick={() => {
                            setShowDeleteDialog(true);
                            setCommandContext({
                                target: 'workspace'
                            });
                        }}
                    >
                        삭제
                    </ContextMenu.Item>
                </ContextMenu.Menu>
                <ContextMenu.Menu id="channel-context-menu">
                    <ContextMenu.Item
                        onClick={({ props }) => {
                            setShowUpdateDialog(true);
                            setCommandContext({
                                target: 'channel',
                                groupId: props.groupId,
                                channelId: props.channelId
                            });
                        }}
                    >
                        이름 변경
                    </ContextMenu.Item>
                    <ContextMenu.Item
                        onClick={({ props }) => {
                            setChannelType(
                                props.channelId,
                                props.groupId,
                                'chatting'
                            );
                        }}
                    >
                        채팅 채널로 변경
                    </ContextMenu.Item>
                    <ContextMenu.Item
                        onClick={({ props }) => {
                            setChannelType(
                                props.channelId,
                                props.groupId,
                                'conference'
                            );
                        }}
                    >
                        회의 채널로 변경
                    </ContextMenu.Item>
                    <ContextMenu.Item
                        onClick={({ props }) => {
                            setShowDeleteDialog(true);
                            setCommandContext({
                                target: 'channel',
                                groupId: props.groupId,
                                channelId: props.channelId
                            });
                        }}
                    >
                        삭제
                    </ContextMenu.Item>
                </ContextMenu.Menu>
                <ContextMenu.Menu id="group-context-menu">
                    <ContextMenu.Item
                        onClick={({ props }) => {
                            setShowCreateDialog(true);
                            setCommandContext({
                                target: 'channel',
                                groupId: props.groupId
                            });
                        }}
                    >
                        새 채널 만들기
                    </ContextMenu.Item>
                    <ContextMenu.Item
                        onClick={({ props }) => {
                            setShowUpdateDialog(true);
                            setCommandContext({
                                target: 'group',
                                groupId: props.groupId
                            });
                        }}
                    >
                        이름 변경
                    </ContextMenu.Item>
                    <ContextMenu.Item
                        onClick={({ props }) => {
                            setShowDeleteDialog(true);
                            setCommandContext({
                                target: 'group',
                                groupId: props.groupId
                            });
                        }}
                    >
                        삭제
                    </ContextMenu.Item>
                </ContextMenu.Menu>
            </div>
            <div>
                <Modal
                    isOpen={showDeleteDialog}
                    onAction={onCloseDeleteDialog}
                    buttons="yesno"
                >
                    정말로 삭제 하시겠습니까?
                </Modal>
                <Modal
                    isOpen={showCreateDialog}
                    onAction={onCloseCreateDialog}
                    buttons="okcancel"
                >
                    <Form>
                        <Label>사용할 이름을 입력해주세요.</Label>
                        <Input
                            value={inputText}
                            onChange={onChangedInputText}
                            style={{ marginTop: '16px', marginBottom: '4px' }}
                        />
                    </Form>
                </Modal>
                <Modal
                    isOpen={showUpdateDialog}
                    onAction={onCloseUpdateDialog}
                    buttons="okcancel"
                >
                    <Form>
                        <Label>새로운 이름을 입력해주세요.</Label>
                        <Input
                            value={inputText}
                            onChange={onChangedInputText}
                            style={{ marginTop: '16px', marginBottom: '4px' }}
                        />
                    </Form>
                </Modal>
                <Modal
                    isOpen={showInviteDialog}
                    onAction={onCloseInviteDialog}
                    buttons="okcancel"
                >
                    <Form>
                        <Label>초대할 상대의 이름을 입력해주세요.</Label>
                        <Input
                            value={inputText}
                            onChange={onChangedInputText}
                            style={{ marginTop: '16px', marginBottom: '4px' }}
                        />
                    </Form>
                </Modal>
                <Modal
                    isOpen={showCodeDialog}
                    onAction={onCloseCodeDialog}
                    buttons="ok"
                >
                    <p>Code : {inviteCode ?? "Loading..."}</p>
                </Modal>
                <UserPermissionModal
                    isOpen={showPermissionDialog}
                    onAction={() => setShowPermissionDialog(false)}
                />
            </div>
        </div>
    );
}

export default Workspace;
