import ChatInput from '@/components/ChatInput';
import { ChatArea } from './style';
import { ChatAvatar, ChatPlainText } from '@/components/ChatItem';
import { ChatList } from '@/components/ChatItem/style';
import gravatar from 'gravatar';
import React, { useCallback, useEffect, useState } from 'react';
import { ChannelHeader } from '@/layouts/Workspace/style';
import useRoom from '@/hooks/useRoom';
import useSocket from '@/hooks/useSocket';
import { IMessage } from '@/types';
import { unixToDate } from '@/util/date';

// TODO Login session cookie is not handled.
function Chatting() {
    const { channelId, channelInfo, workspaceId } = useRoom();
    const [socket] = useSocket(workspaceId);
    const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
    const [chatInput, setChatInput] = useState('');

    const onChangeText = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setChatInput(e.target.value);
        },
        []
    );

    const onChatSubmit = useCallback(() => {
        if (chatInput) {
            socket.emit('message', chatInput);
            setChatInput('');
        }
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

    useEffect(() => {
        socket.emit('select-messages', channelId, (messages: IMessage[]) => {
            setChatMessages(messages);
        });
        setChatMessages([]);
    }, [channelId, socket]);

    return (
        <>
            <ChannelHeader>{channelInfo?.name}</ChannelHeader>
            <ChatArea>
                <ChatList>
                    {chatMessages.map((message, idx) => (
                        <div key={idx}>
                            <ChatAvatar
                                src={gravatar.url(message.sender, {
                                    s: '36px',
                                    d: 'retro'
                                })}
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
