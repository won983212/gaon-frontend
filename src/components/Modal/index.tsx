import React from 'react';
import Button from '../Button';
import { Actions, Content, ModalPanel, ModalWrapper } from './style';

export type Buttons = 'ok' | 'yesno' | 'yesnocancel';
export type Action = 'ok' | 'yes' | 'no' | 'cancel';

export interface ModelProps {
    isOpen: boolean;
    buttons?: Buttons;
    onAction: (action: Action) => void;
    children: React.ReactNode;
}

export default function Modal({
    isOpen,
    onAction,
    buttons = 'ok',
    children
}: ModelProps) {
    return (
        <ModalWrapper className={isOpen ? 'open' : ''}>
            <ModalPanel>
                <Content>{children}</Content>
                <Actions>
                    {buttons === 'ok' ? (
                        <Button
                            onClick={() => onAction('ok')}
                            size="small"
                            variant="text"
                        >
                            확인
                        </Button>
                    ) : (
                        <>
                            <Button
                                onClick={() => onAction('yes')}
                                size="small"
                                variant="text"
                            >
                                예
                            </Button>
                            <Button
                                onClick={() => onAction('no')}
                                size="small"
                                variant="text"
                            >
                                아니오
                            </Button>
                            {buttons === 'yesnocancel' ? (
                                <Button
                                    onClick={() => onAction('cancel')}
                                    size="small"
                                    variant="text"
                                >
                                    취소
                                </Button>
                            ) : (
                                <></>
                            )}
                        </>
                    )}
                </Actions>
            </ModalPanel>
        </ModalWrapper>
    );
}
