import { Position } from '@/types';
import { BrushStyle } from '../types';
import { applyStyle } from '../utils/RenderUtils';
import { IDrawElement } from './IDrawElement';
import { checkHitLine } from '@/components/Whiteboard/utils/CollisionDetectors';

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
        if (this.path.length >= 2) {
            applyStyle(context, this.style);
            if (this.highlight) {
                context.strokeStyle = '#cccccc';
            }

            // 라인을 커브로 부드럽게 연결해서 더 자연스럽게 연출
            context.beginPath();
            context.moveTo(this.path[0].x, this.path[0].y);
            let i: number;
            for (i = 1; i < this.path.length - 2; i++) {
                const midX = (this.path[i].x + this.path[i + 1].x) / 2;
                const midY = (this.path[i].y + this.path[i + 1].y) / 2;
                context.quadraticCurveTo(
                    this.path[i].x,
                    this.path[i].y,
                    midX,
                    midY
                );
            }

            i = this.path.length - 2;
            context.quadraticCurveTo(
                this.path[i].x,
                this.path[i].y,
                this.path[i + 1].x,
                this.path[i + 1].y
            );
            /*for (let i = 1; i < this.path.length; i++) {
                context.lineTo(this.path[i].x, this.path[i].y);
            }*/
            context.stroke();
            context.closePath();
        }
    }

    public isHit(pos: Position, radius: number): boolean {
        for (let i = 0; i < this.path.length - 1; i++) {
            if (checkHitLine(pos, radius, this.path[i], this.path[i + 1])) {
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
