import React, { useCallback, useEffect, useRef, useState } from 'react';
import autosize from 'autosize';

interface CanvasBoardProps {
    canvasWidth: number;
    canvasHeight: number;
}

interface Coord {
    x: number;
    y: number;
}

function toCanvasCoord(canvas: HTMLCanvasElement | null, e: MouseEvent) {
    if (!canvas) {
        return;
    }
    return {
        x: e.pageX - canvas.offsetLeft,
        y: e.pageY - canvas.offsetTop
    };
}

function drawLine(canvas: HTMLCanvasElement | null, from: Coord, to: Coord) {
    if (!canvas) {
        return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
        return;
    }

    context.strokeStyle = 'dodgerblue';
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
}

export default function CanvasBoard({
    canvasWidth,
    canvasHeight
}: CanvasBoardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mousePos, setMousePos] = useState<Coord | undefined>(undefined);
    const [isPressed, setIsPressed] = useState(false);

    const startPaint = useCallback((e: MouseEvent) => {
        const pos = toCanvasCoord(canvasRef.current, e);
        if (pos) {
            setIsPressed(true);
            setMousePos(pos);
        }
    }, []);

    const paint = useCallback(
        (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (isPressed) {
                const nextPos = toCanvasCoord(canvasRef.current, e);
                if (mousePos && nextPos) {
                    drawLine(canvasRef.current, mousePos, nextPos);
                    setMousePos(nextPos);
                }
            }
        },
        [isPressed, mousePos]
    );

    const endPaint = useCallback((e: MouseEvent) => {
        setIsPressed(false);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        autosize(canvas);
        canvas.addEventListener('mousedown', startPaint);
        canvas.addEventListener('mouseup', endPaint);
        canvas.addEventListener('mousemove', paint);
        canvas.addEventListener('mouseleave', endPaint);

        return () => {
            canvas.removeEventListener('mousedown', startPaint);
            canvas.removeEventListener('mouseup', endPaint);
            canvas.removeEventListener('mousemove', paint);
            canvas.removeEventListener('mouseleave', endPaint);
        };
    }, [endPaint, paint, startPaint]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    }, [canvasWidth, canvasHeight]);

    return <canvas ref={canvasRef} style={{ position: 'absolute' }} />;
}
