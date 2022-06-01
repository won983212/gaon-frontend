import { Position } from '@/types';
import { BrushStyle, SerializedDrawElement } from '../types';
import { applyStyle } from '../utils/RenderUtils';
import { AbstractDrawElement, ElementIdentifier } from './AbstractDrawElement';
import { checkHitLine } from '@/components/Whiteboard/utils/CollisionDetectors';
import { DrawElementType } from '@/components/Whiteboard/registry';

export class LineElement extends AbstractDrawElement {
    public readonly pos1: Position;
    public readonly pos2: Position;

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

    public getType(): DrawElementType {
        return 'line';
    }

    public serialize(): SerializedDrawElement {
        return {
            id: this.id,
            type: 'line',
            style: this.style,
            data: {
                pos1: this.pos1,
                pos2: this.pos2
            }
        };
    }

    public static deserialize(element: SerializedDrawElement, highlight: boolean): AbstractDrawElement {
        return new LineElement(
            element.id,
            element.data.pos1,
            element.data.pos2,
            element.style,
            highlight
        );
    }
}
