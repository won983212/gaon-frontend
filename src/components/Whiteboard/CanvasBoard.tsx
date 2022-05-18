import React, { useCallback, useEffect, useRef, useState } from 'react';
import DrawContext, { PaintStyle } from '@/components/Whiteboard/DrawContext';
import autosize from 'autosize';
import { toCanvasCoord } from '@/util/util';
import { Eraser, ITool, Move, Pencil } from '@/components/Whiteboard/Tools';

export type Tool = 'pencil' | 'eraser' | 'move';

interface CanvasBoardProps {
    canvasWidth: number;
    canvasHeight: number;
    tool: Tool;
    lineStyle: PaintStyle;
}

export default function CanvasBoard({
    canvasWidth,
    canvasHeight,
    tool,
    lineStyle
}: CanvasBoardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawCtxRef = useRef<DrawContext | null>(null);
    const [isPressed, setIsPressed] = useState(false);

    const startPaint = useCallback((e: React.MouseEvent) => {
        if (e.button === 0) {
            const pos = toCanvasCoord(e, canvasRef);
            if (pos) {
                setIsPressed(true);
                if (drawCtxRef.current) {
                    drawCtxRef.current.onPress(pos);
                }
            }
        }
    }, []);

    const paint = (e: React.MouseEvent) => {
        if (e.button === 0) {
            e.preventDefault();
            e.stopPropagation();
            if (isPressed) {
                const pos = toCanvasCoord(e, canvasRef);
                if (pos && drawCtxRef.current) {
                    drawCtxRef.current.onDragMove(pos);
                }
            }
        }
    };

    const endPaint = useCallback((e: React.MouseEvent) => {
        if (e.button === 0) {
            setIsPressed(false);
            if (drawCtxRef.current) {
                drawCtxRef.current.onRelease();
            }
        }
    }, []);

    const createTool = useCallback(
        (tool: Tool, lineStyle: PaintStyle): ITool => {
            switch (tool) {
                case 'pencil':
                    return new Pencil(lineStyle);
                case 'eraser':
                    return new Eraser(1);
                case 'move':
                    return new Move();
                default:
                    throw new Error('unknown tool: ' + tool);
            }
        },
        []
    );

    useEffect(() => {
        if (canvasRef.current) {
            autosize(canvasRef.current);
        }
        drawCtxRef.current = new DrawContext(
            canvasRef,
            createTool(tool, lineStyle)
        );
    }, []);

    useEffect(() => {
        if (drawCtxRef.current) {
            drawCtxRef.current.setTool(createTool(tool, lineStyle));
        }
    }, [tool, lineStyle]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        const context = canvas.getContext('2d');
        if (context) {
            const devicePixelRatio = window.devicePixelRatio ?? 1;
            canvas.width = canvasWidth * devicePixelRatio;
            canvas.height = canvasHeight * devicePixelRatio;
            canvas.style.width = canvasWidth + 'px';
            canvas.style.height = canvasHeight + 'px';
            context.scale(devicePixelRatio, devicePixelRatio);
            if (drawCtxRef.current) {
                drawCtxRef.current.repaint();
            }
        }
    }, [canvasWidth, canvasHeight]);

    return (
        <canvas
            ref={canvasRef}
            style={{ position: 'absolute' }}
            onMouseDown={startPaint}
            onMouseUp={endPaint}
            onMouseMove={paint}
            onMouseLeave={endPaint}
        />
    );
}
