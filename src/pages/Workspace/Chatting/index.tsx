import ChatInput from '@/components/ChatInput';
import { ChatArea } from './style';
import {
    ChatAttachment,
    ChatAvatar,
    ChatPlainText
} from '@/components/ChatItem';
import { ChatList } from '@/components/ChatItem/style';
import gravatar from 'gravatar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChannelHeader } from '@/layouts/Workspace/style';
import useRoom from '@/hooks/useRoom';
import useSocket from '@/hooks/useSocket';
import { FileMessage, IMessage, TextMessage } from '@/types';
import { unixToDate } from '@/util/date';
import { Form, Label } from '@/pages/Login/style';
import Modal, { Action } from '@/components/Modal';

const maxFileSizeMB = 10;

// TODO Login session cookie is not handled.
function Chatting() {
    const { channelId, channelInfo, workspaceId } = useRoom();
    const [socket] = useSocket(workspaceId);
    const [showUploadFileDialog, setShowUploadFileDialog] = useState(false);
    const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const fileInput = useRef<HTMLInputElement>(null);

    const onChangeText = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setChatInput(e.target.value);
        },
        []
    );

    const onChatSubmit = useCallback(() => {
        if (chatInput) {
            socket.emit('chat-message', chatInput);
            setChatInput('');
        }
    }, [chatInput, socket]);

    const onUploadFile = useCallback(() => {
        setShowUploadFileDialog(true);
    }, []);

    const onMessage = useCallback(
        (message: IMessage) => {
            setChatMessages(chatMessages.concat(message));
        },
        [chatMessages]
    );

    const onCloseUploadFileDialog = useCallback(
        (action: Action) => {
            if (action === 'ok') {
                const files = fileInput.current?.files;
                if (files && files.length > 0 && files[0]) {
                    if (files[0].size > 1024 * 1024 * maxFileSizeMB) {
                        alert(`용량이 ${maxFileSizeMB}MB를 넘습니다.`);
                    } else {
                        socket.emit(
                            'chat-file',
                            files[0],
                            files[0].name,
                            (success: boolean) => {
                                if (!success) {
                                    alert('업로드 실패했습니다.');
                                }
                                if (fileInput.current) {
                                    fileInput.current.value = '';
                                }
                                setShowUploadFileDialog(false);
                            }
                        );
                    }
                    setChatInput('');
                } else {
                    alert('파일을 선택해주세요.');
                }
            } else {
                setShowUploadFileDialog(false);
            }
        },
        [socket]
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
            <Modal
                isOpen={showUploadFileDialog}
                onAction={onCloseUploadFileDialog}
                buttons="okcancel"
            >
                <Form>
                    <Label>
                        업로드할 파일을 선택해주세요. 최대 10MB까지 가능합니다.
                    </Label>
                    <input
                        type="file"
                        ref={fileInput}
                        style={{ marginTop: '16px', marginBottom: '4px' }}
                    />
                </Form>
            </Modal>
            <ChatArea>
                <ChatList>
                    {chatMessages.map((message, idx) => {
                        let body;
                        if (message.type === 'text') {
                            const textMessage = message as TextMessage;
                            body = (
                                <ChatPlainText>
                                    {textMessage.message}
                                </ChatPlainText>
                            );
                        } else {
                            const fileMessage = message as FileMessage;
                            body = (
                                <ChatAttachment
                                    path={'/file/' + fileMessage.url}
                                    filename={fileMessage.name}
                                />
                            );
                        }
                        return (
                            <div key={idx}>
                                <ChatAvatar
                                    src={gravatar.url(message.sender, {
                                        s: '36px',
                                        d: 'retro'
                                    })}
                                    userName={message.sender}
                                    date={unixToDate(message.date)}
                                />
                                {body}
                            </div>
                        );
                    })}
                </ChatList>
                <ChatInput
                    text={chatInput}
                    onChangeText={onChangeText}
                    onUploadFile={onUploadFile}
                    onSubmit={onChatSubmit}
                />
            </ChatArea>
        </>
    );
}

export default Chatting;
