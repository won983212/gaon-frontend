import React from 'react';
import Button from '../Button';
import { Actions, Content, ModalPanel, ModalWrapper } from './style';

export type Buttons = 'ok' | 'yesno' | 'yesnocancel' | 'okcancel';
export type Action = 'ok' | 'yes' | 'no' | 'cancel';

export interface ModelProps {
    isOpen: boolean; // modal이 열려있는지?
    buttons?: Buttons; // 어떤 버튼으로 구성되어있는지?
    onAction: (action: Action) => void; // 버튼 클릭시 callback
    children: React.ReactNode; // contents
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
                    {(buttons === 'ok' || buttons === 'okcancel') && (
                        <Button
                            onClick={() => onAction('ok')}
                            size="small"
                            variant="text"
                        >
                            확인
                        </Button>
                    )}
                    {(buttons === 'yesno' || buttons === 'yesnocancel') && (
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
                        </>
                    )}
                    {(buttons === 'yesnocancel' || buttons === 'okcancel') && (
                        <Button
                            onClick={() => onAction('cancel')}
                            size="small"
                            variant="text"
                        >
                            취소
                        </Button>
                    )}
                </Actions>
            </ModalPanel>
        </ModalWrapper>
    );
}
