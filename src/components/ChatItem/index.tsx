import React from 'react';
import {
    ChatItem,
    ChatAvatarImg,
    ChatBorderDiv,
    ChatDateSpan,
    ChatFileBox,
    ChatFileImg,
    ChatFileInfo,
    ChatImageThumbnail,
    ChatList
} from './style';

// 대화내용의 첫 내용은 반드시 들어가야함.
export function ChatAvatar({ src, userName, date }: IChatAvatar) {
    return (
        <ChatItem>
            <ChatAvatarImg src={src} />
            <div>
                {userName}
                <ChatDateSpan>{date}</ChatDateSpan>
            </div>
        </ChatItem>
    );
}

// 날짜 구분선
export function ChatBorder({ date }: IChatBorder) {
    return <ChatBorderDiv>{date}</ChatBorderDiv>;
}

// 텍스트
export function ChatPlainText({ content }: IChatText) {
    return (
        <ChatItem>
            <div>{content}</div>
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

// 첨부파일
export function ChatAttachment({
    iconSrc,
    path,
    info,
    filename,
    date
}: IChatAttachment) {
    return (
        <ChatItem>
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
    content: string;
    date?: string;
}

interface IChatAvatar {
    src: string;
    userName: string;
    date?: string;
}

interface IChatBorder {
    date?: string;
}
