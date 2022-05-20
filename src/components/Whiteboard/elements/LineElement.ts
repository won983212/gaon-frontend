import { Position } from '@/types';
import { BrushStyle } from '../types';
import { applyStyle } from '../RenderUtils';
import { IDrawElement } from './IDrawElement';
import { checkHitLine } from '@/util/util';

export class LineElement implements IDrawElement {
    public readonly pos1: Position;
    public readonly pos2: Position;
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

    public draw(context: CanvasRenderingContext2D): void {
        applyStyle(context, this.style);
        if (this.highlight) {
            context.strokeStyle = '#cccccc';
        }

        context.beginPath();
        context.moveTo(this.pos1.x, this.pos1.y);
        context.lineTo(this.pos2.x, this.pos2.y);
        context.closePath();
        context.stroke();
    }

    public isHit(pos: Position, radius: number): boolean {
        return checkHitLine(pos, radius, this.pos1, this.pos2);
    }

    public setHighlight(highlight: boolean): IDrawElement {
        if (this.highlight === highlight) {
            return this;
        }
        return new LineElement(this.pos1, this.pos2, this.style, highlight);
    }
}
