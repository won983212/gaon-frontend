import { Position } from '@/types';
import { ToolType } from '@/components/Whiteboard/types';
import { CanvasContext } from '@/components/Whiteboard/useCanvasContext';
import React from 'react';
import { IDrawElement, PathPaint } from '@/components/Whiteboard/DrawElements';

export interface CanvasDrawingContext {
    canvasContext: CanvasContext;
    setCanvasContext: React.Dispatch<React.SetStateAction<CanvasContext>>;
    drawingElement: IDrawElement | undefined;
    setDrawingElement: React.Dispatch<
        React.SetStateAction<IDrawElement | undefined>
    >;
    get2dContext: () => CanvasRenderingContext2D | undefined;
}

export interface ITool {
    /** 마우스 포인터를 그림. undefined면 그리지 않음. */
    shouldRenderCursor?: () => boolean;

    /** 툴 타입을 리턴함 */
    getToolType: () => ToolType;

    /** 마우스 버튼을 눌렀을 때 이벤트. */
    onPress?: (event: CanvasDrawingContext, pos: Position) => void;

    /** 마우스 버튼을 누르면서 움직였을 때 이벤트. */
    onDrag?: (
        event: CanvasDrawingContext,
        pos: Position,
        delta: Position
    ) => void;

    /** 마우스 이동 이벤트. (drag할 경우에는 호출 안됨) */
    onMove?: (event: CanvasDrawingContext, pos: Position) => void;

    /** 마우스 버튼을 땠을 때 이벤트. Release후에 자동으로 repaint가 진행됨.
     * lineStyle이 undefined라면, dragPath은 style을 뺀 Position[]으로 설정됨. */
    onRelease?: (
        event: CanvasDrawingContext,
        element: IDrawElement | undefined
    ) => void;
}

export const Move = (): ITool => ({
    shouldRenderCursor: () => false,

    onDrag: (event: CanvasDrawingContext, pos: Position, delta: Position) => {
        event.setCanvasContext((prev) => ({
            ...event.canvasContext,
            camPos: {
                x: prev.camPos.x - delta.x,
                y: prev.camPos.y - delta.y
            }
        }));
    },

    getToolType: () => 'move'
});

export const Eraser = (): ITool => {
    const eliminateNear = (event: CanvasDrawingContext, pos: Position) => {
        const radius = event.canvasContext.brush.thickness;
        event.setCanvasContext((prev) => ({
            ...prev,
            elements: prev.elements.filter(
                (element) => !element.isHit(pos, radius)
            )
        }));
    };

    return {
        onMove: (event: CanvasDrawingContext, pos: Position) => {
            const radius = event.canvasContext.brush.thickness;
            event.setCanvasContext((prev) => ({
                ...prev,
                elements: prev.elements.map((element) => {
                    if (element.isHit(pos, radius)) {
                        return element.setHighlight(true);
                    }
                    return element.setHighlight(false);
                })
            }));
        },

        getToolType: () => 'eraser',

        onPress: eliminateNear,

        onDrag: eliminateNear
    };
};

export const Pencil = (): ITool => ({
    onPress: (event: CanvasDrawingContext, pos: Position) => {
        event.setDrawingElement(
            new PathPaint([pos], event.canvasContext.brush)
        );
    },

    onDrag: (event: CanvasDrawingContext, pos: Position) => {
        const paint = event.drawingElement as PathPaint;
        if (!paint) {
            return;
        }

        let newPosHolder: Position | undefined = undefined;
        if (paint.path.length > 0) {
            let dx = paint.path[paint.path.length - 1].x - pos.x;
            let dy = paint.path[paint.path.length - 1].y - pos.y;
            if (dx * dx + dy * dy > 20) {
                // sqrt(20)보다 이동거리가 짧으면 drawing요청 무시
                newPosHolder = pos;
            }
        } else {
            newPosHolder = pos;
        }

        if (newPosHolder) {
            const newPos: Position = newPosHolder;
            event.setDrawingElement((prev) => {
                const elem: PathPaint = prev as PathPaint;
                return new PathPaint(
                    elem.path.concat(newPos),
                    elem.style,
                    elem.highlight
                );
            });
        }
    },

    onRelease: (
        event: CanvasDrawingContext,
        element: IDrawElement | undefined
    ) => {
        if (element) {
            event.setCanvasContext((prev) => ({
                ...prev,
                elements: prev.elements.concat(element)
            }));
        }
    },

    getToolType: () => 'pencil'
});

export const getToolFromType = (tool: ToolType) => {
    switch (tool) {
        case 'pencil':
            return Pencil();
        case 'eraser':
            return Eraser();
        case 'move':
            return Move();
        default:
            throw new Error('unknown tool: ' + tool);
    }
};
