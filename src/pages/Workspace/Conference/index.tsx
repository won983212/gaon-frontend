import React, { useCallback, useEffect, useState } from 'react';
import Modal, { Action } from '@/components/Modal';
import useRoom from '@/hooks/useRoom';
import { useNavigate } from 'react-router';
import loadable from '@loadable/component';
import useConferenceTabIndex from '@/hooks/useConferenceTabIndex';
import useSocket from '@/hooks/useSocket';
import { IConnectedUser } from '@/types';
import * as ContextMenu from 'react-contexify';
import useUser from '@/hooks/useUser';
import { useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import { banUserFromWorkspace, removeAdmin, useAdminsSWR, useAdminSWR } from '@/api/user';
import { kick } from './voice-client';
export interface UserProps {
    userId: number;
}

export interface ConferenceTabProps {
    users: IConnectedUser[];
    onShowUserContextMenu: (e: React.MouseEvent, userId: number) => void;
}

const TabCodeShare = loadable(() => import('./TabCodeShare'));
const TabBoardShare = loadable(() => import('./TabBoardShare'));

function Conference() {
    const navigate = useNavigate();
    const { channelInfo, channelId, workspaceId } = useRoom();
    const [socket] = useSocket(workspaceId);
    const [showEnterDialog, setShowEnterDialog] = useState(true);
    const { data: conferenceTabIndex } = useConferenceTabIndex();
    const [users, setUsers] = useState<IConnectedUser[]>([]);
    const {user: userData, identifier, setCookie} = useUser();
    const adminData = useAdminSWR(workspaceId, userData?.id, identifier.token);
    const isAdmin = adminData.data?.permission !== 0;
    const { show: showUserContextMenu } = useContextMenu({id: 'user-context-menu'});
    const onShowUserContextMenu = (e: React.MouseEvent, userId: number) => {
        e.preventDefault();
        showUserContextMenu(e, {
            props: {
                userId: userId
            }
        });
    }

    const onCloseEnterDialog = useCallback(
        (action: Action) => {
            if (action === 'yes') {
                setShowEnterDialog(false);
            } else {
                navigate(`/workspace/${workspaceId}/channel`);
            }
        },
        [navigate, workspaceId]
    );

    const onJoinUser = useCallback((user: IConnectedUser) => {
        setUsers((prev) => prev.concat(user));
    }, []);

    const onLeaveUser = useCallback((user: IConnectedUser) => {
        setUsers((prev) =>
            prev.filter((ent) => ent.socketId !== user.socketId)
        );
    }, []);

    useEffect(() => {
        socket.on('join-user', onJoinUser);
        socket.on('leave-user', onLeaveUser);
        return () => {
            socket.off('join-user', onJoinUser);
            socket.off('leave-user', onLeaveUser);
        };
    }, [socket, onJoinUser, onLeaveUser]);

    useEffect(() => {
        setShowEnterDialog(true);
        socket.emit('select-users', channelId, (users: IConnectedUser[]) => {
            setUsers(users);
        });
    }, [channelId, socket]);

    if (showEnterDialog) {
        return (
            <Modal isOpen={true} onAction={onCloseEnterDialog} buttons="yesno">
                {channelInfo?.name} 회의에 참가하시겠습니까?
            </Modal>
        );
    }

    let routedTab = <p>Empty</p>;
    switch (conferenceTabIndex) {
        case 0:
            routedTab = <TabCodeShare users={users} onShowUserContextMenu={onShowUserContextMenu}/>;
            break;
        case 1:
            routedTab = <TabBoardShare users={users} onShowUserContextMenu={onShowUserContextMenu}/>;
            break;
    }

    return <>{routedTab}<div>
        {isAdmin && <ContextMenu.Menu id="user-context-menu">
            <ContextMenu.Item onClick={(props) => {
                // 음성 채팅 서버랑 인터렉션에서 둘 다 킥
                console.log(`workspaceId:${workspaceId}`);
                socket.emit("kick-user", workspaceId, channelId, props.props.userId, identifier.token);
                kick(props.props.userId, identifier.token);
            }}>추방하기</ContextMenu.Item>
            <ContextMenu.Item onClick={(props) => {
                console.log(`workspaceId:${workspaceId}`);
                banUserFromWorkspace(workspaceId, identifier.id, props.props.userId, identifier.token);
                socket.emit("kick-user", workspaceId, channelId, props.props.userId, identifier.token);
                kick(props.props.userId, identifier.token);
                // 음성 채팅 서버랑 인터렉션에서 둘 다 킥
                console.log("영구밴 %d at %d", props.props.userId, workspaceId);
            }}>프로젝트에서 제외</ContextMenu.Item></ContextMenu.Menu>}
        </div></>;
}

export default Conference;
