import { doLogout, useUsersSWR } from '@/api/auth';
import { useChannelsSWR } from '@/api/workspace';
import ChannelList from '@/components/ChannelList';
import Menu from '@/components/Menu';
import Profile from '@/components/Profile';
import gravatar from 'gravatar';
import React, { useCallback, useState } from 'react';
import { Navigate } from 'react-router';
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
import useChannel from '@/hooks/useChannel';

interface WorkspaceProps {
    children: React.ReactNode;
}

function Workspace({ children }: WorkspaceProps) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { data: channelInfo } = useChannel();
    const { data: userData, mutate } = useUsersSWR();
    const { data: channelCategories } = useChannelsSWR(0);

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
                    <WorkspaceName>
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
                        <MenuIconWrapper>
                            <MdMenu size={16} />
                        </MenuIconWrapper>
                    </WorkspaceName>
                    <MenuScroll>
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
                            >
                                코드
                            </Button>
                            <Button size="small" style={{ flex: 1 }} noPadding>
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
        </div>
    );
}

export default Workspace;
