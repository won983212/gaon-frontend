import { Position } from '@/types';
import { applyStyle } from '@/components/Whiteboard/Renderers';
import { BrushStyle } from '@/components/Whiteboard/types';
import Vec from '@/util/vec';

/** 보드에 그려질 수 있는 요소. 반드시 불변성을 유지해야함. */
export interface IDrawElement {
    readonly highlight: boolean;

    /** 이 요소를 실제로 render한다. canvas context에 render */
    draw: (context: CanvasRenderingContext2D) => void;

    /**
     * <code>pos</code>를 중심으로 반지름이 <code>radius</code>인
     * 원과 닿아있으면 <code>true</code>리턴, 아니면 <code>false</code>리턴.
     */
    isHit: (pos: Position, radius: number) => boolean;

    /**
     * highlight를 설정한 새로운 object를 반환한다.
     * highlight가 바뀌지 않았을 경우에는 this를 반환한다.
     */
    setHighlight: (highlight: boolean) => IDrawElement;
}

/** 드래그해서 그린 하나의 선을 PaintPath로 정의함.
 * 향후 아이콘이나 template shape의 경우에는 더 확장해야할 것임. */
export class PathPaint implements IDrawElement {
    public readonly path: Position[];
    public readonly style: BrushStyle;
    public readonly highlight: boolean;

    public constructor(
        path: Position[],
        style: BrushStyle,
        highlight: boolean = false
    ) {
        this.path = path;
        this.style = style;
        this.highlight = highlight;
    }

    public draw(context: CanvasRenderingContext2D): void {
        if (this.style && this.path.length > 0) {
            applyStyle(context, this.style);
            if (this.highlight) {
                context.strokeStyle = '#cccccc';
            }

            context.beginPath();
            context.moveTo(this.path[0].x, this.path[0].y);
            for (let i = 1; i < this.path.length; i++) {
                context.lineTo(this.path[i].x, this.path[i].y);
            }
            context.stroke();
            context.closePath();
        }
    }

    // TODO 알고리즘이 좀 이상하네?
    public isHit(pos: Position, radius: number): boolean {
        for (let i = 0; i < this.path.length - 1; i++) {
            let AB = new Vec(
                this.path[i + 1].x - this.path[i].x,
                this.path[i + 1].y - this.path[i].y
            );
            let AP = new Vec(pos.x - this.path[i].x, pos.y - this.path[i].y);

            AB.scale(AB.dot(AP) / AP.distance());
            AB.subtractVec(AP);

            let minDist = radius + this.style.thickness / 2;
            if (AB.sqDist() < minDist * minDist) {
                return true;
            }
        }
        return false;
    }

    public setHighlight(highlight: boolean): IDrawElement {
        if (this.highlight === highlight) {
            return this;
        }
        return new PathPaint(this.path, this.style, highlight);
    }
}
