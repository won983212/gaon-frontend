import React, { useCallback } from 'react';
import Menu from '@/components/Menu';
import {
    ColorButton,
    CommonMenuStyle,
    MenuLabel,
    PaletteMenuFlexBox,
    SelectContainer,
    ThicknessButton
} from '../style';
import { CanvasContext } from '@/components/Whiteboard/types';
import {
    fillColors,
    strokeColors,
    strokeThickness
} from '@/components/Whiteboard/registry';

interface PaletteMenuProps {
    open: boolean;
    onClose: () => void;
    left: number;
    top: number;
    canvasCtx: CanvasContext;
    setCanvasCtx: React.Dispatch<React.SetStateAction<CanvasContext>>;
}

export default function PaletteMenu({
                                        open,
                                        onClose,
                                        left,
                                        top,
                                        canvasCtx,
                                        setCanvasCtx
                                    }: PaletteMenuProps) {
    const setStyle = useCallback(
        (fillStyle: string, strokeStyle: string, thickness: number) => {
            setCanvasCtx((prev) => ({
                ...prev,
                brush: {
                    ...prev.brush,
                    fillStyle,
                    strokeStyle,
                    thickness
                }
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
            <PaletteMenuFlexBox>
                <MenuLabel>선 색상</MenuLabel>
                <SelectContainer>
                    {strokeColors.map((color) => (
                        <ColorButton
                            key={color}
                            color={color}
                            selected={canvasCtx.brush.strokeStyle === color}
                            onClick={() =>
                                setStyle(
                                    canvasCtx.brush.fillStyle,
                                    color,
                                    canvasCtx.brush.thickness
                                )
                            }
                        />
                    ))}
                </SelectContainer>
                <MenuLabel>채우기 색상</MenuLabel>
                <SelectContainer>
                    {fillColors.map((color) => (
                        <ColorButton
                            key={color}
                            color={color}
                            selected={canvasCtx.brush.fillStyle === color}
                            onClick={() =>
                                setStyle(
                                    color,
                                    canvasCtx.brush.strokeStyle,
                                    canvasCtx.brush.thickness
                                )
                            }
                        />
                    ))}
                </SelectContainer>
                <MenuLabel>굵기</MenuLabel>
                <SelectContainer>
                    {strokeThickness.map((thickness) => (
                        <ThicknessButton
                            key={thickness}
                            thickness={thickness}
                            selected={canvasCtx.brush.thickness === thickness}
                            onClick={() =>
                                setStyle(
                                    canvasCtx.brush.fillStyle,
                                    canvasCtx.brush.strokeStyle,
                                    thickness
                                )
                            }
                        >
                            <div />
                        </ThicknessButton>
                    ))}
                </SelectContainer>
            </PaletteMenuFlexBox>
        </Menu>
    );
}
