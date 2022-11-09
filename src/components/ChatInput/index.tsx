import autosize from 'autosize';
import React, { useCallback, useEffect, useRef } from 'react';
import { ChatArea as ChatForm } from './style';
import { MdUploadFile } from 'react-icons/all';

interface ChatInputProps {
    text: string;
    onSubmit: () => void;
    onUploadFile: () => void;
    onChangeText: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeHolder?: string;
}

export default function ChatInput({
    text,
    onSubmit,
    onUploadFile,
    onChangeText,
    placeHolder
}: ChatInputProps) {
    const chatInputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (chatInputRef.current) {
            autosize(chatInputRef.current);
        }
    }, []);

    const onKeyDownText = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
                if (chatInputRef.current) {
                    chatInputRef.current.style.height = '32px';
                }
            }
        },
        [onSubmit]
    );

    const onClickSubmit = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            onSubmit();
        },
        [onSubmit]
    );

    const onClickUploadFile = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            onUploadFile();
        },
        [onUploadFile]
    );

    return (
        <ChatForm>
            <textarea
                value={text}
                onKeyDown={onKeyDownText}
                onChange={onChangeText}
                placeholder={placeHolder}
                ref={chatInputRef}
            />
            <button className="upload" onClick={onClickUploadFile}>
                <MdUploadFile />
            </button>
            <button onClick={onClickSubmit}>전송</button>
        </ChatForm>
    );
}
