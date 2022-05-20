import { Position } from '@/types';
import { BrushStyle } from '../types';
import { applyStyle } from '../RenderUtils';
import { IDrawElement } from './IDrawElement';

export class CircleElement implements IDrawElement {
    public readonly pos: Position; // center point
    public readonly radius: number;
    public readonly style: BrushStyle;
    public readonly highlight: boolean;

    public constructor(
        pos: Position,
        radius: number,
        style: BrushStyle,
        highlight: boolean = false
    ) {
        this.pos = pos;
        this.radius = radius;
        this.style = style;
        this.highlight = highlight;
    }

    public draw(context: CanvasRenderingContext2D): void {
        applyStyle(context, this.style);
        if (this.highlight) {
            context.strokeStyle = '#cccccc';
        }

        context.beginPath();
        context.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
        context.stroke();
    }

    public isHit(pos: Position, radius: number): boolean {
        const dx = pos.x - this.pos.x;
        const dy = pos.y - this.pos.y;
        const r = radius + this.radius;
        return dx * dx + dy * dy < r * r;
    }

    public setHighlight(highlight: boolean): IDrawElement {
        if (this.highlight === highlight) {
            return this;
        }
        return new CircleElement(this.pos, this.radius, this.style, highlight);
    }
}
