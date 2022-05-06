import ChatInput from '@/components/ChatInput';
import { ChatArea } from './style';
import { ChatAvatar, ChatBorder, ChatPlainText } from '@/components/ChatItem';
import { ChatList } from '@/components/ChatItem/style';
import gravatar from 'gravatar';
import React, { useCallback, useState } from 'react';

function Chatting() {
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
        setChatInput('');
    }, []);

    return (
        <ChatArea>
            <ChatList>
                <ChatAvatar src={avatar} userName="Jo" date="2022-04-25" />
                <ChatPlainText>안녕하세요.</ChatPlainText>
                <ChatPlainText>채팅 테스트입니다.</ChatPlainText>
                <ChatPlainText>
                    간격이 잘 유지되는 모습이 보입니다.
                </ChatPlainText>
                <ChatPlainText>다음은 날짜 구분선입니다.</ChatPlainText>
                <ChatBorder>2022-04-25</ChatBorder>
                <ChatAvatar src={avatar} userName="Jo" date="2022-04-25" />
                <ChatPlainText>안녕히 계세요~</ChatPlainText>
            </ChatList>
            <ChatInput
                text={chatInput}
                onChangeText={onChangeText}
                onSubmit={onChatSubmit}
            />
        </ChatArea>
    );
}

export default Chatting;
