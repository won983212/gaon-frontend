import { Position } from '@/types';
import { BrushStyle } from '../types';
import { applyStyle } from '../utils/RenderUtils';
import { AbstractDrawElement } from './AbstractDrawElement';
import { checkHitCircle } from '@/components/Whiteboard/utils/CollisionDetectors';

export class CircleElement extends AbstractDrawElement {
    public readonly pos: Position; // center point
    public readonly radius: number;

    public constructor(
        id: string,
        pos: Position,
        radius: number,
        style: BrushStyle,
        highlight: boolean = false
    ) {
        super(id, style, highlight);
        this.pos = pos;
        this.radius = radius;
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
        return checkHitCircle(pos, this.pos, radius + this.radius);
    }

    public newHighlight(highlight: boolean): AbstractDrawElement {
        if (this.highlight === highlight) {
            return this;
        }
        return new CircleElement(
            this.id,
            this.pos,
            this.radius,
            this.style,
            highlight
        );
    }
}
