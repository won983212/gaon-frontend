import React, { useCallback, useEffect } from 'react';
import autosize from 'autosize';
import { toCanvasCoord } from '@/util/util';
import { CanvasEvents } from '@/components/Whiteboard/useCanvasContext';

interface CanvasBoardProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    canvasWidth: number;
    canvasHeight: number;
    events: CanvasEvents;
}

export default function CanvasBoard({
    canvasRef,
    canvasWidth,
    canvasHeight,
    events
}: CanvasBoardProps) {
    const startPaint = useCallback(
        (e: React.MouseEvent) => {
            if (e.button === 0) {
                const pos = toCanvasCoord(e, canvasRef);
                if (pos) {
                    events.onPress(pos);
                }
            }
        },
        [canvasRef, events]
    );

    const paint = (e: React.MouseEvent) => {
        if (e.button === 0) {
            e.preventDefault();
            e.stopPropagation();
            const pos = toCanvasCoord(e, canvasRef);
            if (pos) {
                events.onMove(pos, {
                    x: e.movementX,
                    y: e.movementY
                });
            }
        }
    };

    const endPaint = useCallback(
        (e: React.MouseEvent) => {
            if (e.button === 0) {
                events.onRelease();
            }
        },
        [events]
    );

    // initialize
    useEffect(() => {
        if (canvasRef.current) {
            autosize(canvasRef.current);
        }
    }, [canvasRef]);

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
        }
    }, [canvasWidth, canvasHeight, canvasRef]);

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
