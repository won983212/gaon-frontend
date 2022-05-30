import { Position } from '@/types';
import { CanvasContext, ToolType } from '../types';
import React from 'react';
import {
    AbstractDrawElement,
    ElementIdentifier
} from '../elements/AbstractDrawElement';

export interface CanvasDrawingContext {
    canvasContext: CanvasContext;
    setCanvasContext: React.Dispatch<React.SetStateAction<CanvasContext>>;
    get2dContext: () => CanvasRenderingContext2D | undefined;
    appendDrawingElement: () => void;
    cancelDrawingElement: () => void;
    removeDrawElement: (id: ElementIdentifier) => void;
    generateNewId: () => ElementIdentifier;
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
        element: AbstractDrawElement | undefined
    ) => void;
}

/**
 * 좀 더 편리하게 CanvasDrawingContext의 DrawingElement를 수정하는 유틸 메서드.
 * 편의를 위해 setter의 매개변수인 prev에 undefined를 포함시키지 않았다.
 * 따라서 prev가 반드시 undefined가 아닌 경우에만 setter function을 사용할 것.
 */
export function setDrawingElement<T extends AbstractDrawElement>(
    ctx: CanvasDrawingContext,
    setter: ((prev: T) => T) | T
): void {
    ctx.setCanvasContext((prev) => ({
        ...prev,
        drawingElement:
            typeof setter === 'function'
                ? setter(prev.drawingElement as T)
                : setter
    }));
}
