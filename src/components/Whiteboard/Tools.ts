import { Position } from '@/types';
import DrawContext, {
    PaintPath,
    PaintStyle
} from '@/components/Whiteboard/DrawContext';
import Vec from '@/util/vec';

export interface ITool {
    /** undefined이면, line-drawing을 사용하지 않음. */
    readonly lineStyle: PaintStyle | undefined;

    /** 마우스 버튼을 눌렀을 때 이벤트. */
    onPress?: (context: DrawContext, pos: Position) => void;

    /** 마우스 버튼을 누르면서 움직였을 때 이벤트. */
    onDrag?: (context: DrawContext, pos: Position) => void;

    /** 마우스 버튼을 땠을 때 이벤트. Release후에 자동으로 repaint가 진행됨.
     * lineStyle이 undefined라면, dragPath은 style을 뺀 Position[]으로 설정됨. */
    onRelease?: (
        context: DrawContext,
        dragPath: PaintPath | Position[]
    ) => void;
}

export class Move implements ITool {
    public readonly lineStyle: PaintStyle | undefined = undefined;
}

export class Eraser implements ITool {
    public readonly lineStyle: PaintStyle | undefined = undefined;
    private readonly radius: number;

    constructor(radius: number) {
        this.radius = radius;
    }

    private isEraseTarget(mousePos: Position, path: PaintPath) {
        for (let i = 0; i < path.path.length - 1; i++) {
            let AB = new Vec(
                path.path[i + 1].x - path.path[i].x,
                path.path[i + 1].y - path.path[i].y
            );
            let AP = new Vec(
                mousePos.x - path.path[i].x,
                mousePos.y - path.path[i].y
            );
            AB.scale(AB.dot(AP) / AP.distance());
            AB.subtractVec(AP);

            let minDist = this.radius + path.style.thickness;
            if (AB.sqDist() < minDist * minDist) {
                return true;
            }
        }
        return false;
    }

    public onDrag(context: DrawContext, pos: Position) {
        let prevLen = context.paints.length;
        context.paints = context.paints.filter(
            (path) => !this.isEraseTarget(pos, path)
        );
        if (prevLen !== context.paints.length) {
            context.repaint();
        }
    }
}

export class Pencil implements ITool {
    public readonly lineStyle: PaintStyle;

    constructor(initialStyle: PaintStyle) {
        this.lineStyle = initialStyle;
    }

    public onRelease(context: DrawContext, dragPath: PaintPath | Position[]) {
        context.paints.push(dragPath as PaintPath);
    }
}
