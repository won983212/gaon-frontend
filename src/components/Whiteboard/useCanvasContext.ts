/* eslint-disable react-hooks/exhaustive-deps */
import { IDrawElement } from './elements/IDrawElement';
import { BrushStyle, ToolType } from './types';
import { Position } from '@/types';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { clearBoard, drawCursor } from './RenderUtils';
import { CanvasDrawingContext, getToolFromType } from './tools/ITool';
import {
    fillColors,
    strokeColors,
    strokeThickness
} from '@/components/Whiteboard/PaletteMenu';
import { TextElement } from '@/components/Whiteboard/elements/TextElement';

export interface CanvasContext {
    tool: ToolType;
    brush: BrushStyle;
    camPos: Position;
    zoom: number;
    elements: IDrawElement[];
    drawingElement: IDrawElement | undefined;
}

export interface CanvasEvents {
    onPress: (pos: Position) => void;
    onMove: (pos: Position, delta: Position) => void;
    onRelease: () => void;
}

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
        appendDrawingElement
    });

    const appendDrawingElement = () => {
        if (canvasCtx.drawingElement) {
            const element: IDrawElement = canvasCtx.drawingElement;
            setCanvasCtx((prev) => ({
                ...prev,
                elements: prev.elements.concat(element)
            }));
        }
    };

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
                setCanvasCtx((prev) => ({
                    ...prev,
                    drawingElement: undefined
                }));
            }
            setIsPressed(false);
        }
    };

    useLayoutEffect(() => {
        repaint();
    }, [mousePos, canvasCtx.camPos, canvasCtx.elements]);

    return {
        canvasRef,
        canvasCtx,
        setCanvasCtx,
        repaint,
        mousePos,
        events: { onPress, onMove, onRelease }
    };
}
