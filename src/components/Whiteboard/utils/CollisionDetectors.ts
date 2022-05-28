import { Position, Size } from '@/types';
import Vec from '@/util/vec';
import { slice } from '@/util/math';

export function checkHitLine(
    pos: Position,
    radius: number,
    lineStart: Position,
    lineEnd: Position
) {
    const d = new Vec(lineEnd.x - lineStart.x, lineEnd.y - lineStart.y);
    if (d.sqDist() === 0) {
        return checkHitCircle(pos, lineStart, radius);
    }

    const f = new Vec(lineStart.x - pos.x, lineStart.y - pos.y);
    const a = d.dot(d);
    const b = 2 * f.dot(d);
    const c = f.dot(f) - radius * radius;

    // Line을 직선이라 가정했을 때
    // D<0인 경우는 아얘 line이 circle과 닿지 않는 경우.
    // D>=0이면 닿긴 닿음. t1, t2지점에서. 물론 0과 1사이여야
    // 실제 line범위내에서 닿았다고 할 수 있음.
    let D = b * b - 4 * a * c;
    if (D >= 0) {
        D = Math.sqrt(D);
        const t1 = (-b - D) / (2 * a);
        const t2 = (-b + D) / (2 * a);
        return (
            (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1) || (t1 <= 0 && t2 >= 1)
        );
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
    return dx * dx + dy * dy < radius * radius;
}
