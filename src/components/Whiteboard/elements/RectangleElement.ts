import { Position, Size } from '@/types';
import { BrushStyle, SerializedDrawElement } from '../types';
import { applyStyle } from '../utils/RenderUtils';
import { AbstractDrawElement, ElementIdentifier } from './AbstractDrawElement';
import { checkHitAABB } from '@/components/Whiteboard/utils/CollisionDetectors';
import { DrawElementType } from '@/components/Whiteboard/registry';

export class RectangleElement extends AbstractDrawElement {
    public readonly pos1: Position; // top-left point
    public readonly pos2: Position; // bottom-right point

    public constructor(
        id: ElementIdentifier,
        pos1: Position,
        pos2: Position,
        style: BrushStyle,
        highlight: boolean = false
    ) {
        super(id, style, highlight);
        this.pos1 = pos1;
        this.pos2 = pos2;
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
        return checkHitAABB(pos, radius, this.getPosition(), this.getSize());
    }

    public getType(): DrawElementType {
        return 'rectangle';
    }

    public serialize(): SerializedDrawElement {
        return {
            id: this.id,
            type: 'rectangle',
            style: this.style,
            data: {
                pos1: this.pos1,
                pos2: this.pos2
            }
        };
    }

    public static deserialize(element: SerializedDrawElement, highlight: boolean): AbstractDrawElement {
        return new RectangleElement(
            element.id,
            element.data.pos1,
            element.data.pos2,
            element.style,
            highlight
        );
    }
}
