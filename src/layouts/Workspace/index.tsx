import { doLogout } from '@/api/auth';
import { useChannelsSWR, useWorkspacesSWR } from '@/api/workspace';
import ChannelList from '@/components/ChannelList';
import Menu from '@/components/Menu';
import Profile from '@/components/Profile';
import gravatar from 'gravatar';
import React, { useCallback, useState } from 'react';
import { Navigate } from 'react-router';
import * as ContextMenu from 'react-contexify';
import "react-contexify/dist/ReactContexify.css";
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
import { DropdownContent, DropdownItem, DropdownList } from '@/components/Dropdown';

interface WorkspaceProps {
    children: React.ReactNode;
}

function Workspace({ children }: WorkspaceProps) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
    const { channelInfo } = useRoom();
    const { user: userData, identifier, setCookie } = useUser();
    const { data: channelCategories } = useChannelsSWR(0);
    const { mutate: setConferenceTabIndex } = useConferenceTabIndex();
    const workspaceList = [
        {
            id: 0,
            name: "hi",
            createdBy: 0
        },
        {
            id: 1,
            name: "hello, there",
            createdBy: 0
        }
    ]
    const onLogout = useCallback(() => {
        doLogout(identifier?.token).then(() => {
            setCookie(undefined);
        });
    }, [identifier?.token, setCookie]);

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
        alert("workspace changed.");
    }

    const onShowWorkspaceContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        ContextMenu.contextMenu.show({id: "workspace-context-menu", event: e})
    }

    const onShowGroupContextMenu = (e: React.MouseEvent, groupId: number) => {
        e.preventDefault();
        ContextMenu.contextMenu.show({id: "group-context-menu", event: e, props: {
            groupId: groupId
        } })
    }

    const onShowChannelContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        ContextMenu.contextMenu.show({id: "channel-context-menu", event: e })
    }

    const onShowUserContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        ContextMenu.contextMenu.show({id: "user-context-menu", event: e })
    }


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
                                username="cc"
                                avatarUrl={gravatar.url('cc', {
                                    s: '36px',
                                    d: 'retro'
                                })}
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
                                    {workspaceList?.map((ws)=> {
                                        return <DropdownItem onClick={()=>{onCloseWorkspaceMenu(); changeWorkspace(ws.id)}}>{ws.name}</DropdownItem>
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
                                    groupId={0} 
                                    onShowGroupContextMenu={function (e: React.MouseEvent, groupId: number) {
                                        throw new Error('Function not implemented.');
                                    }} 
                                    onShowChannelContextMenu={function (e: React.MouseEvent, channelId: number) {
                                        throw new Error('Function not implemented.');
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
                <ContextMenu.Menu id="workspace-context-menu">
                    <ContextMenu.Item>New workspace</ContextMenu.Item>
                    <ContextMenu.Item>Update</ContextMenu.Item>
                    <ContextMenu.Item>Delete</ContextMenu.Item>
                </ContextMenu.Menu>
                <ContextMenu.Menu id="channel-context-menu">
                <ContextMenu.Item>New channel</ContextMenu.Item>
                <ContextMenu.Item>Update</ContextMenu.Item>
                <ContextMenu.Item>Delete</ContextMenu.Item>
                </ContextMenu.Menu>
                <ContextMenu.Menu id="group-context-menu">
                    <ContextMenu.Item>New group</ContextMenu.Item>
                    <ContextMenu.Item>Update</ContextMenu.Item>
                    <ContextMenu.Item>Delete</ContextMenu.Item>
                </ContextMenu.Menu>
                <ContextMenu.Menu id="user-context-menu">
                    <ContextMenu.Item>Kick</ContextMenu.Item>
                    <ContextMenu.Item>Ban</ContextMenu.Item>
                </ContextMenu.Menu>                
            </div>
        </div>
    );
}

export default Workspace;
