import autosize from 'autosize';
import React, { useCallback, useEffect, useRef } from 'react';
import { ChatArea as ChatForm } from './style';

interface ChatInputProps {
    text: string;
    onSubmit: () => void;
    onChangeText: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeHolder?: string;
}

export default function ChatInput({
    text,
    onSubmit,
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

    return (
        <ChatForm>
            <textarea
                value={text}
                onKeyDown={onKeyDownText}
                onChange={onChangeText}
                placeholder={placeHolder}
                ref={chatInputRef}
            />
            <button onClick={onSubmit}>전송</button>
        </ChatForm>
    );
}
