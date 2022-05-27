import ChatInput from '@/components/ChatInput';
import { ChatArea } from './style';
import { ChatAvatar, ChatPlainText } from '@/components/ChatItem';
import { ChatList } from '@/components/ChatItem/style';
import gravatar from 'gravatar';
import React, { useCallback, useEffect, useState } from 'react';
import { ChannelHeader } from '@/layouts/Workspace/style';
import useChannel from '@/hooks/useChannel';
import useSocket from '@/hooks/useSocket';
import { IMessage } from '@/types';
import { useParams } from 'react-router';
import { unixToDate } from '@/util/date';

function Chatting() {
    const { workspaceId } = useParams();
    const [socket] = useSocket(`/workspace-${workspaceId}`);
    const { data: channelInfo } = useChannel();
    const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const avatar = gravatar.url('Jo', {
        s: '36px',
        d: 'retro'
    });

    const onChangeText = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setChatInput(e.target.value);
        },
        []
    );

    const onChatSubmit = useCallback(() => {
        socket.emit('message', chatInput);
        setChatInput('');
    }, [chatInput, socket]);

    const onMessage = useCallback(
        (message: IMessage) => {
            setChatMessages(chatMessages.concat(message));
        },
        [chatMessages]
    );

    useEffect(() => {
        socket.on('message', onMessage);
        return () => {
            socket.off('message', onMessage);
        };
    }, [socket, onMessage]);

    return (
        <>
            <ChannelHeader>{channelInfo?.name}</ChannelHeader>
            <ChatArea>
                <ChatList>
                    {chatMessages.map((message, idx) => (
                        <div key={idx}>
                            <ChatAvatar
                                src={avatar}
                                userName={message.sender}
                                date={unixToDate(message.date)}
                            />
                            <ChatPlainText>{message.message}</ChatPlainText>
                        </div>
                    ))}
                </ChatList>
                <ChatInput
                    text={chatInput}
                    onChangeText={onChangeText}
                    onSubmit={onChatSubmit}
                />
            </ChatArea>
        </>
    );
}

export default Chatting;
