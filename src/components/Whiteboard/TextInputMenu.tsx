import React, { useCallback } from 'react';
import Menu from '@/components/Menu';
import useInput from '@/hooks/useInput';
import styled from 'styled-components';

interface TextInputMenuProps {
    open: boolean;
    onClose: (text: string) => void;
    left: number;
    top: number;
}

const TextInputElement = styled.input`
    border: none;
    background: none;
    outline: none;
`;

export default function TextInputMenu({
    open,
    onClose,
    left,
    top
}: TextInputMenuProps) {
    const [value, onChanged] = useInput('');

    const onCloseMenu = useCallback(() => {
        onClose(value);
    }, [onClose, value]);

    const onInputKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Escape' || e.key === 'Enter') {
                onCloseMenu();
            }
        },
        [onCloseMenu]
    );

    if (!open) {
        return <></>;
    }

    return (
        <Menu
            style={{
                left: left,
                top: top,
                background: 'transparent',
                boxShadow: 'none',
                minWidth: '0'
            }}
            onClose={onCloseMenu}
            useCloseBtn={false}
        >
            <TextInputElement
                onChange={onChanged}
                onKeyDown={onInputKeyDown}
                autoFocus={true}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
            />
        </Menu>
    );
}
