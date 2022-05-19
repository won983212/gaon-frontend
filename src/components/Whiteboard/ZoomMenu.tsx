import React, { useCallback } from 'react';
import Menu from '@/components/Menu';
import { CommonMenuStyle } from './style';
import Button from '@/components/Button';
import { CanvasContext } from './useCanvasContext';
import styled from 'styled-components';

interface ZoomMenuProps {
    open: boolean;
    onClose: () => void;
    left: number;
    top: number;
    canvasCtx: CanvasContext;
    setCanvasCtx: React.Dispatch<React.SetStateAction<CanvasContext>>;
}

const MenuFlexBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
`;

export default function ZoomMenu({
    open,
    onClose,
    left,
    top,
    canvasCtx,
    setCanvasCtx
}: ZoomMenuProps) {
    const setZoom = useCallback(
        (zoom: number) => {
            setCanvasCtx((prev) => ({
                ...prev,
                zoom: zoom
            }));
        },
        [setCanvasCtx]
    );

    if (!open) {
        return <></>;
    }

    return (
        <Menu
            style={{
                left: left,
                top: top,
                ...CommonMenuStyle
            }}
            onClose={onClose}
            useCloseBtn={false}
        >
            <MenuFlexBox>
                <span>x{canvasCtx.zoom}</span>
                <input
                    type="range"
                    style={{ margin: '8px 0' }}
                    min={0.25}
                    max={3}
                    step={0.25}
                    value={canvasCtx.zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                />
                <Button
                    size="small"
                    variant="text"
                    style={{ width: '100%' }}
                    onClick={() => setZoom(1)}
                >
                    Reset
                </Button>
            </MenuFlexBox>
        </Menu>
    );
}
