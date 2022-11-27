import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { IMediaUser } from '@/types';
import { VoiceSingleton } from '@/hooks/useVoice';
import useUser from '@/hooks/useUser';

function Channels() {
    const navigate = useNavigate();
    const { channelId, channelInfo, workspaceId } = useRoom();
    const { user, identifier } = useUser()
    const [socket] = useSocket(workspaceId);
    const [voiceSocket] = useSocket(workspaceId, 'voice');
    const [audioList, setAudioList] = useState<IMediaUser[]>([]);
    const voiceRef = useRef<Map<string, HTMLAudioElement | null>>();
    const voiceController = VoiceSingleton.getInstance(voiceSocket, channelId, user?.id);
    
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
    
    const onVoiceDisconnected = useCallback(() => {
        voiceController.cleanUpSocket();
    }, []);

    const onReceiveMedia = useCallback((mediaUserId: number, type: "Camera" | "Voice" | "Screen", kind: "audio" | "video", stream: MediaStream) => {
        setAudioList(audioList.concat({userId: mediaUserId, type: type, kind: kind, stream: stream}));
    }, [audioList]);

    const onUserLeave = useCallback((userId: number) => {
        setAudioList(audioList.filter((value) => {
            value.userId !== userId;
        }));
    }, [audioList]);

    useEffect(() => {
        socket.emit('channel', channelId);
    }, [channelId, socket]);

    useEffect(() => {
        socket.on('disconnect', onDisconnected);
        return () => {
            socket.off('disconnect', onDisconnected);
        };
    }, [onDisconnected, socket]);

    useEffect(() => {
        voiceController.on("startRecv", onReceiveMedia);
        return () => {
            voiceController.off("startRecv", onReceiveMedia);
        }
    }, [onReceiveMedia, voiceController]);

    useEffect(() => {
        voiceController.on("userLeave", onUserLeave);
        return () => {
            voiceController.off("userLeave", onUserLeave)
        }
    }, [onUserLeave, voiceController]);

    useEffect(() => {
        voiceSocket.on('disconnect', onVoiceDisconnected);
        return () => {
            voiceSocket.off('disconnect', onVoiceDisconnected);
        }
    })

    useEffect(() => {
        if (voiceRef.current?.size !== 0) {
            for (let audio of audioList) {
                let id = `${audio.kind}-${audio.type}-${audio.userId}`;
                if (voiceRef.current?.has(id)) {
                    let element = voiceRef.current?.get(id);
                    if (element) {
                        element.srcObject = audio.stream;
                    }
                }
            }
        } 
    }, [voiceRef]);
    return <div>
        <Workspace>{pageElement}</Workspace>
        {
            audioList.map((value, index) => (<audio key={index} ref={(el) => (voiceRef.current?.set(`${value.kind}-${value.type}-${value.userId}`, el))} autoPlay hidden></audio>))
        }
        </div>;
}

export default Channels;
