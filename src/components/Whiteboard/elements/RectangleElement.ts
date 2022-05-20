import { Position, Size } from '@/types';
import { BrushStyle } from '../types';
import { applyStyle } from '../RenderUtils';
import { checkHitAABB } from '@/util/util';
import { IDrawElement } from './IDrawElement';

export class RectangleElement implements IDrawElement {
    public readonly pos1: Position; // top-left point
    public readonly pos2: Position; // bottom-right point
    public readonly style: BrushStyle;
    public readonly highlight: boolean;

    public constructor(
        pos1: Position,
        pos2: Position,
        style: BrushStyle,
        highlight: boolean = false
    ) {
        this.pos1 = pos1;
        this.pos2 = pos2;
        this.style = style;
        this.highlight = highlight;
    }

    public getPosition(): Position {
        return {
            x: Math.min(this.pos1.x, this.pos2.x),
            y: Math.min(this.pos1.y, this.pos2.y)
        };
    }

    public getSize(): Size {
        return {
            width: Math.abs(this.pos2.x - this.pos1.x),
            height: Math.abs(this.pos2.y - this.pos1.y)
        };
    }

    public draw(context: CanvasRenderingContext2D): void {
        applyStyle(context, this.style);
        if (this.highlight) {
            context.strokeStyle = '#cccccc';
        }

        context.beginPath();
        context.moveTo(this.pos1.x, this.pos1.y);
        context.lineTo(this.pos2.x, this.pos1.y);
        context.lineTo(this.pos2.x, this.pos2.y);
        context.lineTo(this.pos1.x, this.pos2.y);
        context.closePath();
        context.fill();
        context.stroke();
    }

    public isHit(pos: Position, radius: number): boolean {
        return checkHitAABB(radius, pos, this.getPosition(), this.getSize());
    }

    public setHighlight(highlight: boolean): IDrawElement {
        if (this.highlight === highlight) {
            return this;
        }
        return new RectangleElement(
            this.pos1,
            this.pos2,
            this.style,
            highlight
        );
    }
}
