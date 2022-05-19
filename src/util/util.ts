import React from 'react';
import { Position, Size } from '@/types';

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

export function checkAABB(
    radius: number,
    pos: Position,
    rectPos: Position,
    rectSize: Size
) {
    const innerX = slice(rectPos.x, rectPos.x + rectSize.width, pos.x);
    const innerY = slice(rectPos.y, rectPos.y + rectSize.height, pos.y);
    const dx = pos.x - innerX;
    const dy = pos.y - innerY;
    return dx * dx + dy * dy < radius;
}
