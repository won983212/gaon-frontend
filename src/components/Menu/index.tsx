import React, { CSSProperties, useCallback } from 'react';
import { CloseButton, MenuLocator } from './style';

interface MenuProps {
    children: React.ReactNode;
    onClose: () => void;
    style?: CSSProperties;
    useCloseBtn?: boolean;
}

export default function Menu({
    children,
    onClose,
    useCloseBtn,
    style
}: MenuProps) {
    const stopPropagation = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    return (
        <MenuLocator onClick={onClose}>
            <div style={style} onClick={stopPropagation}>
                {useCloseBtn && (
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                )}
                {children}
            </div>
        </MenuLocator>
    );
}

Menu.defaultProps = {
    useCloseBtn: true,
    style: {}
};
