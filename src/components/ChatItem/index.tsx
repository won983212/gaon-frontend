import React from 'react';
import {
    ChatAvatarImg,
    ChatBorderDiv,
    ChatDateSpan,
    ChatFileBox,
    ChatFileText,
    ChatImageThumbnail,
    ChatItem,
    NewChatBorder
} from './style';
import { MdOutlineInsertDriveFile } from 'react-icons/all';

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
export function ChatPicture({ src }: IChatImage) {
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
export function ChatAttachment({ path, filename }: IChatAttachment) {
    return (
        <ChatItem draggable={false}>
            <ChatFileBox>
                <MdOutlineInsertDriveFile size="24px" color="var(--text)" />
                <ChatFileText download={filename} href={path} target="_blank" rel="noreferrer">
                    <div>{filename}</div>
                </ChatFileText>
            </ChatFileBox>
        </ChatItem>
    );
}

interface IChatAttachment {
    path: string;
    filename: string;
}

interface IChatImage {
    src: string;
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
