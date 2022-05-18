import { Position } from '@/types';
import DrawContext, {
    PaintPath,
    PaintStyle
} from '@/components/Whiteboard/DrawContext';
import Vec from '@/util/vec';

export interface ITool {
    /** 새 스타일을 생성함. 생성된 스타일은 라인 스타일에 적용됨.
     * line-drawing을 사용하지 않을 경우에는 undefined로 정의하면 됨.*/
    createLineStyle?: () => PaintStyle;

    /** 마우스 포인터를 그림. undefined면 그리지 않음. */
    shouldRenderCursor?: (context: DrawContext) => boolean;

    /** 마우스 버튼을 눌렀을 때 이벤트. */
    onPress?: (context: DrawContext, pos: Position) => void;

    /** 마우스 버튼을 누르면서 움직였을 때 이벤트. */
    onDrag?: (context: DrawContext, pos: Position, delta: Position) => void;

    /** 마우스 이동 이벤트. (drag할 경우에는 호출 안됨) */
    onMove?: (context: DrawContext, pos: Position) => void;

    /** 마우스 버튼을 땠을 때 이벤트. Release후에 자동으로 repaint가 진행됨.
     * lineStyle이 undefined라면, dragPath은 style을 뺀 Position[]으로 설정됨. */
    onRelease?: (
        context: DrawContext,
        dragPath: PaintPath | Position[]
    ) => void;
}

export class Move implements ITool {
    public shouldRenderCursor(context: DrawContext) {
        return false;
    }

    public onDrag(context: DrawContext, pos: Position, delta: Position) {
        let camPos = context.getCameraPos();
        context.setCameraPos({ x: camPos.x - delta.x, y: camPos.y - delta.y });
    }
}

export class Eraser implements ITool {
    private readonly radius: number;

    constructor(radius: number) {
        this.radius = radius;
    }

    /**
     * 마우스와 radius거리 안에 있는 path들을 highlight한다.
     * highlight가 되었다면, true리턴.
     */
    private isNear(mousePos: Position, path: PaintPath) {
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

            let minDist = this.radius + path.style.thickness / 2;
            if (AB.sqDist() < minDist * minDist) {
                return true;
            }
        }
        return false;
    }

    private eliminateNear(context: DrawContext, pos: Position) {
        let prevLen = context.paints.length;
        context.paints = context.paints.filter(
            (path) => !this.isNear(pos, path)
        );
        if (prevLen !== context.paints.length) {
            context.repaint();
        }
    }

    public onMove(context: DrawContext, pos: Position) {
        for (let path of context.paints) {
            path.style.highlight = this.isNear(pos, path);
        }
    }

    public onPress = this.eliminateNear;

    public onDrag = this.eliminateNear;
}

export class Pencil implements ITool {
    private readonly lineStyle: PaintStyle;

    constructor(initialStyle: PaintStyle) {
        this.lineStyle = initialStyle;
    }

    public createLineStyle() {
        return JSON.parse(JSON.stringify(this.lineStyle));
    }

    public onRelease(context: DrawContext, dragPath: PaintPath | Position[]) {
        context.paints.push(dragPath as PaintPath);
    }
}
