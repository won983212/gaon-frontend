import { Position } from '@/types';
import { BrushStyle } from '../types';
import { applyStyle } from '../utils/RenderUtils';
import Vec from '@/util/vec';
import { IDrawElement } from './IDrawElement';

/** 드래그해서 그린 하나의 선. */
export class PathElement implements IDrawElement {
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
        if (this.path.length > 0) {
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
        return new PathElement(this.path, this.style, highlight);
    }
}
