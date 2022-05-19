import React from 'react';

export function toCanvasCoord(
    event: React.MouseEvent,
    canvasRef: React.RefObject<HTMLCanvasElement>
) {
    if (!canvasRef.current) {
        return;
    }
    return {
        x: event.pageX - canvasRef.current.offsetLeft,
        y: event.pageY - canvasRef.current.offsetTop
    };
}

export function slice(min: number, max: number, value: number) {
    return value < min ? min : value > max ? max : value;
}
