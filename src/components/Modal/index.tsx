import React from 'react';
import Button from '../Button';
import { Actions, Content, ModalPanel, ModalWrapper } from './style';

interface ModelProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModelProps) {
    return (
        <ModalWrapper className={isOpen ? 'open' : ''}>
            <ModalPanel>
                <Content>{children}</Content>
                <Actions>
                    <Button onClick={onClose}>닫기</Button>
                </Actions>
            </ModalPanel>
        </ModalWrapper>
    );
}
