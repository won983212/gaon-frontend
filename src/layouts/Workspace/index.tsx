import { doLogout, getUsersSWR } from '@/api/auth';
import { getChannelsSWR } from '@/api/workspace';
import ChannelList from '@/components/ChannelList';
import Menu from '@/components/Menu';
import MenuItem from '@/components/SidebarItem';
import { UserProfile } from '@/components/UserProfile';
import gravatar from 'gravatar';
import React, { useCallback, useState } from 'react';
import { Navigate } from 'react-router';
import {
    ChannelHeader,
    Channels,
    ContentContainer,
    LogOutButton,
    MenuScroll,
    ProfileModal,
    WorkspaceName,
    WorkspaceWrapper
} from './style';

interface WorkspaceProps {
    children: React.ReactNode;
}

function Workspace({ children }: WorkspaceProps) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { data: userData, mutate } = getUsersSWR();
    const { data: channelCategories } = getChannelsSWR(0);

    const onLogout = useCallback(() => {
        doLogout().then(() => {
            mutate(false, false);
        });
    }, [mutate]);

    const onCloseProfileMenu = useCallback(() => {
        setShowProfileMenu(false);
    }, []);

    const onToggleProfileMenu = useCallback(() => {
        setShowProfileMenu((prev) => !prev);
    }, []);

    if (!userData) {
        return <Navigate replace to="/login" />;
    }

    return (
        <div>
            <WorkspaceWrapper>
                <Channels>
                    <WorkspaceName>Project Area</WorkspaceName>
                    <MenuScroll>
                        <MenuItem />
                        {channelCategories?.map((category) => {
                            return (
                                <ChannelList
                                    key={category.id}
                                    name={category.name}
                                    channels={category.channels}
                                />
                            );
                        })}
                    </MenuScroll>
                    {showProfileMenu && (
                        <Menu
                            style={{ left: 8, bottom: 64 }}
                            onClose={onCloseProfileMenu}
                        >
                            <ProfileModal>
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
                            </ProfileModal>
                            <LogOutButton onClick={onLogout}>
                                Logout
                            </LogOutButton>
                        </Menu>
                    )}
                    <WorkspaceName onClick={onToggleProfileMenu}>
                        <UserProfile
                            username={userData.name}
                            avatarUrl={gravatar.url(userData.username, {
                                s: '36px',
                                d: 'retro'
                            })}
                            job={userData.job}
                        />
                    </WorkspaceName>
                </Channels>
                <ContentContainer>
                    <ChannelHeader>Channel!</ChannelHeader>
                    {children}
                </ContentContainer>
            </WorkspaceWrapper>
        </div>
    );
}

export default Workspace;
