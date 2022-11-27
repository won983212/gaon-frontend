import React, { useCallback, useEffect, useState } from 'react';
import Modal, { Action } from '@/components/Modal';
import useRoom from '@/hooks/useRoom';
import { useNavigate } from 'react-router';
import loadable from '@loadable/component';
import useConferenceTabIndex from '@/hooks/useConferenceTabIndex';
import useSocket from '@/hooks/useSocket';
import { IConnectedUser } from '@/types';
import { VoiceSingleton } from '@/hooks/useVoice';
import useUser from '@/hooks/useUser';

export interface ConferenceTabProps {
    users: IConnectedUser[];
}

const TabCodeShare = loadable(() => import('./TabCodeShare'));
const TabBoardShare = loadable(() => import('./TabBoardShare'));

function Conference() {
    const navigate = useNavigate();
    const { channelInfo, channelId, workspaceId } = useRoom();
    const {user, identifier} = useUser();
    const [socket] = useSocket(workspaceId);
    const [voiceSocket] = useSocket(workspaceId, "voice");
    const [showEnterDialog, setShowEnterDialog] = useState(true);
    const { data: conferenceTabIndex } = useConferenceTabIndex();
    const [users, setUsers] = useState<IConnectedUser[]>([]);
    const voiceController = VoiceSingleton.getInstance(voiceSocket, channelId, user?.id);

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

    useEffect(() => {
        voiceController.join(identifier.token, user?.id, channelId);
        navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(
            (value) => voiceController.startSend("Voice", "audio", identifier.token, value.getAudioTracks()[0])
        ).catch(() => console.log("Failed to get user media"));
        return () => {
            voiceSocket.disconnect();
            voiceController.cleanUpSocket();
        }
    }, [voiceController, channelId]);

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
            routedTab = <TabCodeShare users={users} />;
            break;
        case 1:
            routedTab = <TabBoardShare users={users} />;
            break;
    }

    return routedTab;
}

export default Conference;
