import { Position } from '@/types';
import { ToolType } from '../types';
import { CanvasContext } from '../useCanvasContext';
import React from 'react';
import { IDrawElement } from '../elements/IDrawElement';
import Move from './Move';
import Pencil from './Pencil';
import Eraser from './Eraser';
import Rectangle from './Rectangle';
import Circle from './Circle';
import Text from './Text';

export interface CanvasDrawingContext {
    canvasContext: CanvasContext;
    setCanvasContext: React.Dispatch<React.SetStateAction<CanvasContext>>;
    get2dContext: () => CanvasRenderingContext2D | undefined;
    appendDrawingElement: () => void;
}

export interface ITool {
    /** 마우스 포인터를 그림. undefined이면 기본 포인터(원형) render */
    renderCursor?: (ctx: CanvasDrawingContext, mousePos: Position) => void;

    /** 툴 타입을 리턴함 */
    getToolType: () => ToolType;

    /** 마우스 버튼을 눌렀을 때 이벤트. */
    onPress?: (ctx: CanvasDrawingContext, pos: Position) => void;

    /** 마우스 버튼을 누르면서 움직였을 때 이벤트. */
    onDrag?: (
        ctx: CanvasDrawingContext,
        pos: Position,
        delta: Position
    ) => void;

    /** 마우스 이동 이벤트. (drag할 경우에는 호출 안됨) */
    onMove?: (ctx: CanvasDrawingContext, pos: Position) => void;

    /**
     * 마우스 버튼을 땠을 때 이벤트. Release후에 자동으로 repaint가 진행됨.
     * lineStyle이 undefined라면, dragPath은 style을 뺀 Position[]으로 설정됨.
     */
    onRelease?: (
        ctx: CanvasDrawingContext,
        element: IDrawElement | undefined
    ) => void;
}

export const getToolFromType = (tool: ToolType) => {
    switch (tool) {
        case 'pencil':
            return Pencil();
        case 'eraser':
            return Eraser();
        case 'move':
            return Move();
        case 'rectangle':
            return Rectangle();
        case 'circle':
            return Circle();
        case 'text':
            return Text();
        default:
            throw new Error('unknown tool: ' + tool);
    }
};
