import { Position } from '@/types';
import { BrushStyle, SerializedDrawElement } from '../types';
import { applyStyle } from '../utils/RenderUtils';
import { AbstractDrawElement } from './AbstractDrawElement';
import {
    checkHitCircle
} from '@/components/Whiteboard/utils/CollisionDetectors';
import { DrawElementType } from '@/components/Whiteboard/registry';

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

    public getType(): DrawElementType {
        return 'circle';
    }

    public serialize(): SerializedDrawElement {
        return {
            type: 'circle',
            id: this.id,
            style: this.style,
            data: {
                pos: this.pos,
                radius: this.radius
            }
        };
    }

    static deserialize(element: SerializedDrawElement, highlight: boolean): AbstractDrawElement {
        return new CircleElement(
            element.id,
            element.data.pos,
            element.data.radius,
            element.style,
            highlight
        );
    }
}
