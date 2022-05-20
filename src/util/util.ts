import React from 'react';
import { Position, Size } from '@/types';
import Vec from '@/util/vec';

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

export function checkHitLine(
    pos: Position,
    radius: number,
    lineStart: Position,
    lineEnd: Position
) {
    const d = new Vec(lineEnd.x - lineStart.x, lineEnd.y - lineStart.y);
    const f = new Vec(lineStart.x - pos.x, lineStart.y - pos.y);
    const a = d.dot(d);
    const b = 2 * f.dot(d);
    const c = f.dot(f) - radius * radius;

    let discriminant = b * b - 4 * a * c;
    if (discriminant >= 0) {
        discriminant = Math.sqrt(discriminant);
        const t1 = (-b - discriminant) / (2 * a);
        const t2 = (-b + discriminant) / (2 * a);
        return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
    }

    return false;
}

export function checkHitCircle(
    pos: Position,
    circlePos: Position,
    circleRadius: number
) {
    const dx = pos.x - circlePos.x;
    const dy = pos.y - circlePos.y;
    return dx * dx + dy * dy < circleRadius * circleRadius;
}

export function checkHitAABB(
    pos: Position,
    radius: number,
    rectPos: Position,
    rectSize: Size
) {
    const innerX = slice(rectPos.x, rectPos.x + rectSize.width, pos.x);
    const innerY = slice(rectPos.y, rectPos.y + rectSize.height, pos.y);
    const dx = pos.x - innerX;
    const dy = pos.y - innerY;
    return dx * dx + dy * dy < radius;
}
