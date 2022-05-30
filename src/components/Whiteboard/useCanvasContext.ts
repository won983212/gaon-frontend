import {
    AbstractDrawElement,
    ElementIdentifier
} from './elements/AbstractDrawElement';
import { CanvasContext, ToolType } from './types';
import { Position } from '@/types';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { clearBoard, drawCursor } from './utils/RenderUtils';
import { CanvasDrawingContext } from './tools/ITool';
import {
    fillColors,
    strokeColors,
    strokeThickness
} from '@/components/Whiteboard/components/PaletteMenu';
import { TextElement } from '@/components/Whiteboard/elements/TextElement';
import Pencil from '@/components/Whiteboard/tools/Pencil';
import Eraser from '@/components/Whiteboard/tools/Eraser';
import Move from '@/components/Whiteboard/tools/Move';
import Rectangle from '@/components/Whiteboard/tools/Rectangle';
import Line from '@/components/Whiteboard/tools/Line';
import Circle from '@/components/Whiteboard/tools/Circle';
import Text from '@/components/Whiteboard/tools/Text';
import { v4 } from 'uuid';

export interface CanvasEvents {
    onPress: (pos: Position) => void;
    onMove: (pos: Position, delta: Position) => void;
    onRelease: () => void;
}

export const getToolFromType = (tool: ToolType) => {
    switch (tool) {
        case 'pencil':
            return Pencil();
        case 'eraser':
            return Eraser();
        case 'move':
            return Move();
        case 'line':
            return Line();
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

export default function useCanvasContext() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });
    const [isPressed, setIsPressed] = useState(false);
    const [canvasCtx, setCanvasCtx] = useState<CanvasContext>({
        tool: 'pencil',
        brush: {
            strokeStyle: strokeColors[strokeColors.length - 1],
            fillStyle: fillColors[fillColors.length - 1],
            thickness: strokeThickness[1]
        },
        zoom: 1,
        camPos: { x: 0, y: 0 },
        elements: [],
        drawingElement: undefined
    });

    const tool = getToolFromType(canvasCtx.tool);

    const isDoTextInput = () => canvasCtx.drawingElement instanceof TextElement;

    const createEventObject = (): CanvasDrawingContext => ({
        canvasContext: canvasCtx,
        setCanvasContext: setCanvasCtx,
        get2dContext,
        cancelDrawingElement,
        appendDrawingElement,
        removeDrawElement,
        generateNewId
    });

    const cancelDrawingElement = useCallback(() => {
        setCanvasCtx((prev) => ({
            ...prev,
            drawingElement: undefined
        }));
    }, []);

    const removeDrawElement = useCallback((id: ElementIdentifier) => {
        setCanvasCtx((prev) => ({
            ...prev,
            elements: prev.elements.filter((element) => element.id !== id)
        }));
    }, []);

    const appendDrawingElement = useCallback(
        (element?: AbstractDrawElement) => {
            if (!element) {
                element = canvasCtx.drawingElement;
            }
            if (element) {
                setCanvasCtx((prev) => ({
                    ...prev,
                    elements: prev.elements.concat(
                        element as AbstractDrawElement
                    )
                }));
            }
        },
        [canvasCtx.drawingElement]
    );

    const generateNewId = useCallback(() => {
        return v4();
    }, []);

    const get2dContext = useCallback(() => {
        if (!canvasRef.current) {
            return;
        }
        let context = canvasRef.current.getContext('2d');
        if (context) {
            return context;
        }
    }, []);

    const camTransform = useCallback(
        (pos: Position) => {
            return {
                x: pos.x / canvasCtx.zoom + canvasCtx.camPos.x,
                y: pos.y / canvasCtx.zoom + canvasCtx.camPos.y
            };
        },
        [canvasCtx.zoom, canvasCtx.camPos]
    );

    const repaint = () => {
        let context = get2dContext();
        if (!context) {
            return;
        }

        let camPos = canvasCtx.camPos;
        clearBoard(canvasRef, context);

        context.save();
        context.scale(canvasCtx.zoom, canvasCtx.zoom);
        context.translate(-camPos.x, -camPos.y);

        for (let element of canvasCtx.elements) {
            element.draw(context);
        }

        canvasCtx.drawingElement?.draw(context);
        context.restore();

        if (tool.renderCursor) {
            tool.renderCursor(createEventObject(), mousePos);
        } else {
            drawCursor(context, canvasCtx.brush.thickness, mousePos);
        }
    };

    const onPress = (pos: Position) => {
        if (isDoTextInput()) {
            return;
        }
        pos = camTransform(pos);

        if (tool.onPress) {
            tool.onPress(createEventObject(), pos);
        }
        setIsPressed(true);
    };

    const onMove = (pos: Position, delta: Position) => {
        if (mousePos !== pos) {
            setMousePos({ x: pos.x, y: pos.y });
        }
        if (isDoTextInput()) {
            return;
        }
        pos = camTransform(pos);

        if (isPressed) {
            if (tool.onDrag) {
                tool.onDrag(createEventObject(), pos, delta);
            }
        } else if (tool.onMove) {
            tool.onMove(createEventObject(), pos);
        }
    };

    const onRelease = () => {
        if (isPressed) {
            if (!isDoTextInput()) {
                if (tool.onRelease) {
                    tool.onRelease(
                        createEventObject(),
                        canvasCtx.drawingElement
                    );
                }
                cancelDrawingElement();
            }
            setIsPressed(false);
        }
    };

    useLayoutEffect(() => {
        repaint();
    }, [mousePos, canvasCtx.camPos, canvasCtx.elements, repaint]);

    return {
        canvasRef,
        canvasCtx,
        setCanvasCtx,
        mousePos,
        actions: {
            repaint,
            appendDrawingElement,
            unboundDrawingElement: cancelDrawingElement,
            removeDrawElement
        },
        events: { onPress, onMove, onRelease }
    };
}
