import React, { useCallback, useEffect, useRef, useState } from 'react';
import useInput from '@/hooks/useInput';
import {
    ErrorBlock,
    InputArea,
    InputBlock,
    InputSign,
    OutBlock,
    TerminalBlock,
    WarnBlock
} from '@/components/Terminal/style';

interface Line {
    type: 'info' | 'warn' | 'error';
    text: string;
}

export default function Terminal() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, onChanged, setValue] = useInput('');
    const [logs, setLogs] = useState<Line[]>([
        { type: 'info', text: 'Loading...' },
        { type: 'error', text: "Can't find 'src' directory." },
        { type: 'warn', text: '[WARN] This is warning message.' },
        { type: 'info', text: 'Hello, world!' }
    ]);

    const onSubmitTerminal = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            setLogs((prev) => prev.concat({ type: 'info', text: value }));
            setValue('');
        },
        [value, setValue]
    );

    useEffect(() => {
        inputRef.current?.scrollIntoView(false);
    }, [logs]);

    return (
        <TerminalBlock>
            {logs.map((line, idx) => {
                if (line.type === 'info') {
                    return <OutBlock key={idx}>{line.text}</OutBlock>;
                } else if (line.type === 'warn') {
                    return <WarnBlock key={idx}>{line.text}</WarnBlock>;
                } else if (line.type === 'error') {
                    return <ErrorBlock key={idx}>{line.text}</ErrorBlock>;
                }
                return null;
            })}
            <InputBlock onSubmit={onSubmitTerminal}>
                <InputSign>&gt;</InputSign>
                <InputArea onChange={onChanged} value={value} ref={inputRef} />
            </InputBlock>
        </TerminalBlock>
    );
}
