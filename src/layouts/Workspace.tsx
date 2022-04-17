import axios from 'axios';
import React, { useCallback } from 'react';
import { Navigate } from 'react-router';
import styled from 'styled-components';
import useSWR from 'swr';
import gravatar from 'gravatar';
import Channel from '../pages/Channel';

interface WorkspaceProps {
    children: React.ReactNode;
}

function Workspace({ children }: WorkspaceProps) {
    const { data, error, mutate } = useSWR('/api/users', (url) =>
        axios.get(url).then((response) => response.data)
    );

    const onLogout = useCallback(() => {
        axios
            .post('/api/users/logout', null, {
                withCredentials: true
            })
            .then(() => {
                mutate(false, false);
            });
    }, [mutate]);

    if (!data) {
        return <Navigate replace to="/login" />;
    }

    return (
        <div>
            <Header>
                <RightMenu>
                    <span>
                        <ProfileImg
                            src={gravatar.url(data.nickname, {
                                s: '28px',
                                d: 'retro'
                            })}
                            alt={data.nickname}
                        />
                    </span>
                </RightMenu>
            </Header>
            <button onClick={onLogout}>Logout</button>
            <WorkspaceWrapper>
                <Workspaces>Spaces</Workspaces>
                <Channels>
                    <WorkspaceName>Here</WorkspaceName>
                    <MenuScroll>Menu scroll</MenuScroll>
                </Channels>
                <Chats>Here</Chats>
                {children}
            </WorkspaceWrapper>
        </div>
    );
}

export const RightMenu = styled.div`
    float: right;
`;

export const Header = styled.header`
    height: 38px;
    background: #350d36;
    color: #ffffff;
    box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.1);
    padding: 5px;
    text-align: center;
`;

export const ProfileImg = styled.img`
    width: 28px;
    height: 28px;
    position: absolute;
    top: 5px;
    right: 16px;
`;

export const ProfileModal = styled.div`
    display: flex;
    padding: 20px;

    & img {
        display: flex;
    }

    & > div {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
    }

    & #profile-name {
        font-weight: bold;
        display: inline-flex;
    }

    & #profile-active {
        font-size: 13px;
        display: inline-flex;
    }
`;

export const LogOutButton = styled.button`
    border: none;
    width: 100%;
    border-top: 1px solid rgb(29, 28, 29);
    background: transparent;
    display: block;
    height: 33px;
    padding: 5px 20px 5px;
    outline: none;
    cursor: pointer;
`;

export const WorkspaceWrapper = styled.div`
    display: flex;
    flex: 1;
`;

export const Workspaces = styled.div`
    width: 65px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    background: #3f0e40;
    border-top: 1px solid rgb(82, 38, 83);
    border-right: 1px solid rgb(82, 38, 83);
    vertical-align: top;
    text-align: center;
    padding: 15px 0 0;
`;

export const Channels = styled.nav`
    width: 260px;
    display: inline-flex;
    flex-direction: column;
    background: #3f0e40;
    color: rgb(188, 171, 188);
    vertical-align: top;

    & a {
        padding-left: 36px;
        color: inherit;
        text-decoration: none;
        height: 28px;
        line-height: 28px;
        display: flex;
        align-items: center;

        &.selected {
            color: white;
        }
    }

    & .bold {
        color: white;
        font-weight: bold;
    }

    & .count {
        margin-left: auto;
        background: #cd2553;
        border-radius: 16px;
        display: inline-block;
        font-size: 12px;
        font-weight: 700;
        height: 18px;
        line-height: 18px;
        padding: 0 9px;
        color: white;
        margin-right: 16px;
    }

    & h2 {
        height: 36px;
        line-height: 36px;
        margin: 0;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 15px;
    }
`;

export const WorkspaceName = styled.button`
    height: 64px;
    line-height: 64px;
    border: none;
    width: 100%;
    text-align: left;
    border-top: 1px solid rgb(82, 38, 83);
    border-bottom: 1px solid rgb(82, 38, 83);
    font-weight: 900;
    font-size: 24px;
    background: transparent;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding: 0;
    padding-left: 16px;
    margin: 0;
    color: white;
    cursor: pointer;
`;

export const MenuScroll = styled.div`
    height: calc(100vh - 102px);
    overflow-y: auto;
`;

export const WorkspaceModal = styled.div`
    padding: 10px 0 0;

    & h2 {
        padding-left: 20px;
    }

    & > button {
        width: 100%;
        height: 28px;
        padding: 4px;
        border: none;
        background: transparent;
        border-top: 1px solid rgb(28, 29, 28);
        cursor: pointer;

        &:last-of-type {
            border-bottom: 1px solid rgb(28, 29, 28);
        }
    }
`;

export const Chats = styled.div`
    flex: 1;
`;

export const AddButton = styled.button`
    color: white;
    font-size: 24px;
    display: inline-block;
    width: 40px;
    height: 40px;
    background: transparent;
    border: none;
    cursor: pointer;
`;

export const WorkspaceButton = styled.button`
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: white;
    border: 3px solid #3f0e40;
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: 700;
    color: black;
    cursor: pointer;
`;

export default Workspace;
