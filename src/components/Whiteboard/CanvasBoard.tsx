import React, { useCallback, useEffect, useRef } from 'react';
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

    const startPaint = useCallback((e: React.MouseEvent) => {
        if (e.button === 0) {
            const pos = toCanvasCoord(e, canvasRef);
            if (pos && drawCtxRef.current) {
                drawCtxRef.current.onPress(pos);
            }
        }
    }, []);

    const paint = (e: React.MouseEvent) => {
        if (e.button === 0) {
            e.preventDefault();
            e.stopPropagation();
            const pos = toCanvasCoord(e, canvasRef);
            if (pos && drawCtxRef.current) {
                drawCtxRef.current.onMove(pos, {
                    x: e.movementX,
                    y: e.movementY
                });
            }
        }
    };

    const endPaint = useCallback((e: React.MouseEvent) => {
        if (e.button === 0 && drawCtxRef.current) {
            drawCtxRef.current.onRelease();
        }
    }, []);

    const createTool = useCallback(
        (tool: Tool, lineStyle: PaintStyle): ITool => {
            switch (tool) {
                case 'pencil':
                    return new Pencil(lineStyle);
                case 'eraser':
                    return new Eraser(lineStyle.thickness);
                case 'move':
                    return new Move();
                default:
                    throw new Error('unknown tool: ' + tool);
            }
        },
        []
    );

    // initialize
    useEffect(() => {
        if (canvasRef.current) {
            autosize(canvasRef.current);
        }
    }, []);

    // tool(or style) swap handling
    useEffect(() => {
        if (drawCtxRef.current) {
            drawCtxRef.current.setTool(createTool(tool, lineStyle));
        } else {
            drawCtxRef.current = new DrawContext(
                canvasRef,
                createTool(tool, lineStyle)
            );
        }
    }, [tool, lineStyle]);

    // canvas resize handling
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
