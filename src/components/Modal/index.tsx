import React from 'react';
import styled from 'styled-components';
import Button from '../Button';

interface ModelProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const ModalWrapper = styled.div`
    display: none;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.6);

    &.open {
        display: flex;
        align-items: center;
    }
`;

const ModalPanel = styled.div`
    width: 90%;
    max-width: 450px;
    margin: 0 auto;
    border-radius: 0.3rem;
    background-color: #fff;
    overflow: hidden;
`;

const Content = styled.div`
    padding: 16px;
    border-bottom: 1px solid #dee2e6;
    border-top: 1px solid #dee2e6;
`;

const Actions = styled.div`
    padding: 12px 16px;
    text-align: right;
`;

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
