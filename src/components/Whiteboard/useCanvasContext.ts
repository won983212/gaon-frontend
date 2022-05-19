import { IDrawElement } from '@/components/Whiteboard/DrawElements';
import { BrushStyle, ToolType } from '@/components/Whiteboard/types';
import { Position } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { clearBoard, drawCursor } from '@/components/Whiteboard/Renderers';
import {
    CanvasDrawingContext,
    getToolFromType
} from '@/components/Whiteboard/Tools';

export interface CanvasContext {
    tool: ToolType;
    brush: BrushStyle;
    camPos: Position;
    elements: IDrawElement[];
}

export interface CanvasEvents {
    onPress: (pos: Position) => void;
    onMove: (pos: Position, delta: Position) => void;
    onRelease: () => void;
}

export default function useCanvasContext(): {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    canvasCtx: CanvasContext;
    setCanvasCtx: React.Dispatch<React.SetStateAction<CanvasContext>>;
    events: CanvasEvents;
} {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });
    const [isPressed, setIsPressed] = useState<boolean>(false);
    const [drawingElement, setDrawingElement] = useState<
        IDrawElement | undefined
    >(undefined);
    const [canvasCtx, setCanvasCtx] = useState<CanvasContext>({
        tool: 'pencil',
        brush: { color: 'black', thickness: 2 },
        camPos: { x: 0, y: 0 },
        elements: []
    });

    const tool = getToolFromType(canvasCtx.tool);

    const createEventObject = (): CanvasDrawingContext => ({
        canvasContext: canvasCtx,
        setCanvasContext: setCanvasCtx,
        drawingElement,
        setDrawingElement,
        get2dContext
    });

    const get2dContext = useCallback(() => {
        if (!canvasRef.current) {
            return;
        }
        let context = canvasRef.current.getContext('2d');
        if (context) {
            return context;
        }
    }, []);

    const repaint = () => {
        let context = get2dContext();
        if (!context) {
            return;
        }

        let camPos = canvasCtx.camPos;
        clearBoard(canvasRef, context);
        context.translate(-camPos.x, -camPos.y);

        for (let element of canvasCtx.elements) {
            element.draw(context);
        }
        drawingElement?.draw(context);
        context.translate(camPos.x, camPos.y);

        let shouldRenderCursor = true;
        if (tool.shouldRenderCursor) {
            shouldRenderCursor = tool.shouldRenderCursor();
        }
        if (shouldRenderCursor) {
            drawCursor(context, mousePos);
        }
    };

    const onPress = (pos: Position) => {
        pos.x += canvasCtx.camPos.x;
        pos.y += canvasCtx.camPos.y;

        if (tool.onPress) {
            tool.onPress(createEventObject(), pos);
        }
        setIsPressed(true);
    };

    const onMove = (pos: Position, delta: Position) => {
        if (mousePos !== pos) {
            setMousePos({ x: pos.x, y: pos.y });
        }

        pos.x += canvasCtx.camPos.x;
        pos.y += canvasCtx.camPos.y;

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
            if (tool.onRelease) {
                tool.onRelease(createEventObject(), drawingElement);
            }
            setDrawingElement(undefined);
            setIsPressed(false);
        }
    };

    useEffect(() => {
        repaint();
    }, [mousePos, canvasCtx.camPos, canvasCtx.elements]);

    return {
        canvasRef,
        canvasCtx,
        setCanvasCtx,
        events: { onPress, onMove, onRelease }
    };
}
