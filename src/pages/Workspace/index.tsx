import React, { useCallback, useEffect } from 'react';
import Chatting from '@/pages/Workspace/Chatting';
import Conference from '@/pages/Workspace/Conference';
import Workspace from '@/layouts/Workspace';
import {
    IconContainer,
    NoChannelMessageWrapper
} from '@/pages/Workspace/style';
import { MdOutlineInsertEmoticon } from 'react-icons/all';
import useRoom from '@/hooks/useRoom';
import useSocket from '@/hooks/useSocket';
import { useNavigate } from 'react-router';
import {
    initializeContext,
    isContextActive,
    joinToVoiceServer,
    leaveContext
} from '@/pages/Workspace/Conference/voice-client';
import { ChannelType } from '@/types';

function Channels() {
    const navigate = useNavigate();
    const { channelId, channelInfo, workspaceId } = useRoom();
    const [socket] = useSocket(workspaceId);

    let pageElement: JSX.Element = (
        <NoChannelMessageWrapper>
            <IconContainer>
                <MdOutlineInsertEmoticon />
            </IconContainer>
            <h2>채널을 선택해주세요!</h2>
        </NoChannelMessageWrapper>
    );

    if (channelInfo) {
        if (channelInfo.type === 'chatting') {
            pageElement = <Chatting />;
        } else {
            pageElement = <Conference />;
        }
    }

    const onDisconnected = useCallback(() => {
        navigate(`/workspace/${workspaceId}/channel/`);
    }, [navigate, workspaceId]);

    const onChannelIDChanged = async (channelId: number, channelType?: ChannelType) => {
        if (isContextActive()) {
            await leaveContext();
        }
        if (channelId !== -1 && channelType === 'conference') {
            await initializeContext();
            await joinToVoiceServer();
        }
    };

    useEffect(() => {
        socket.emit('channel', channelId);
    }, [channelId, socket]);

    useEffect(() => {
        onChannelIDChanged(channelId, channelInfo?.type);
    }, [channelId, channelInfo?.type]);

    useEffect(() => {
        socket.on('disconnect', onDisconnected);
        return () => {
            socket.off('disconnect', onDisconnected);
        };
    }, [onDisconnected, socket]);

    return <Workspace>{pageElement}</Workspace>;
}

export default Channels;
