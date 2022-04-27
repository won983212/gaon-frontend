import { ChatAvatar, ChatBorder, ChatPlainText } from '@/components/ChatItem';
import { ChatList } from '@/components/ChatItem/style';
import Workspace from '@/layouts/Workspace';
import React from 'react';
import { useParams } from 'react-router';
import gravatar from 'gravatar';
import styled from 'styled-components';

function Channels() {
    const { channelId } = useParams();
    const avatar = gravatar.url("Jo", {
        s: '36px',
        d: 'retro'
    })
    // 발표가 급하니 일단 채널에 임시로..
    return (<Workspace>
            <ChatPadding>
            <ChatList>
                <ChatAvatar src={avatar} userName="Jo" date="2022-04-25"></ChatAvatar>
                <ChatPlainText content="안녕하세요."></ChatPlainText>
                <ChatPlainText content="채팅 테스트입니다."></ChatPlainText>
                <ChatPlainText content="간격이 잘 유지되는 모습이 보입니다."></ChatPlainText>
                <ChatPlainText content="다음은 날짜 구분선입니다."></ChatPlainText>
                <ChatBorder date="2022-04-25"></ChatBorder>
                <ChatAvatar src={avatar} userName="Jo" date="2022-04-25"></ChatAvatar>
                <ChatPlainText content="안녕히 계세요~"></ChatPlainText>           
            </ChatList></ChatPadding>
        </Workspace>
        

    );
}
const ChatPadding = styled.div`
    padding: 2em;
`;

export default Channels;
