import React from 'react';
import {
    ChatAvatarImg,
    ChatBorderDiv,
    ChatDateSpan,
    ChatFileBox,
    ChatFileImg,
    ChatFileInfo,
    ChatImageThumbnail,
    ChatItem,
    NewChatBorder
} from './style';

// 대화내용의 첫 내용은 반드시 들어가야함.
export function ChatAvatar({ src, userName, date }: IChatAvatar) {
    return (
        <ChatItem>
            <ChatAvatarImg src={src} draggable={false} />
            <div>
                {userName}
                <ChatDateSpan>{date}</ChatDateSpan>
            </div>
        </ChatItem>
    );
}

// 날짜 구분선
export function ChatBorder({ children }: IChatBorder) {
    return <ChatBorderDiv>{children}</ChatBorderDiv>;
}

// 텍스트
export function ChatPlainText({ children }: IChatText) {
    return (
        <ChatItem>
            <div>{children}</div>
        </ChatItem>
    );
}
// 사진
export function ChatPicture({ src, date }: IChatImage) {
    return (
        <ChatItem>
            <a href={src}>
                <ChatImageThumbnail src={src}></ChatImageThumbnail>
            </a>
        </ChatItem>
    );
}

export function NewChat({ children }: IChatText) {
    return <NewChatBorder>{children}</NewChatBorder>;
}

// 첨부파일
export function ChatAttachment({
    iconSrc,
    path,
    info,
    filename,
    date
}: IChatAttachment) {
    return (
        <ChatItem draggable={false}>
            <ChatFileBox>
                <ChatFileImg src={iconSrc}></ChatFileImg>
                <ChatFileInfo>
                    <a href={path}>
                        <div>{filename}</div>
                    </a>
                    <div>{info}</div>
                </ChatFileInfo>
            </ChatFileBox>
        </ChatItem>
    );
}

interface IChatAttachment {
    iconSrc: string;
    path: string;
    info: string;
    filename: string;
    date?: string;
}

interface IChatImage {
    src: string;
    date?: string;
}

interface IChatText {
    children: React.ReactNode;
    date?: string;
}

interface IChatAvatar {
    src: string;
    userName: string;
    date: string;
}

interface IChatBorder {
    children: React.ReactNode;
}
