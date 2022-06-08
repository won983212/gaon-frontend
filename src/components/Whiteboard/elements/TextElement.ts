import { Position, Size } from '@/types';
import { BrushStyle, SerializedDrawElement } from '../types';
import { applyStyle } from '../utils/RenderUtils';
import { AbstractDrawElement, ElementIdentifier } from './AbstractDrawElement';
import { checkHitAABB } from '@/components/Whiteboard/utils/CollisionDetectors';
import { DrawElementType } from '@/components/Whiteboard/registry';

export class TextElement extends AbstractDrawElement {
    public readonly pos: Position; // top-left point
    public readonly text: string;

    // 내부적으로만 사용됨. 불변성 유지할 필요 x
    private textMetrics: TextMetrics | undefined;

    public constructor(
        id: ElementIdentifier,
        pos: Position,
        text: string,
        style: BrushStyle,
        highlight: boolean = false
    ) {
        super(id, style, highlight);
        this.pos = pos;
        this.text = text;
        this.textMetrics = undefined;
    }

    private getRenderSize(): Size {
        if (!this.textMetrics) {
            return { width: 0, height: 0 };
        }
        return {
            width: this.textMetrics.width,
            height:
                this.textMetrics.fontBoundingBoxAscent +
                this.textMetrics.fontBoundingBoxDescent
        };
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.textMetrics = context.measureText(this.text);
        const renderSize = this.getRenderSize();

        if (this.highlight) {
            context.strokeStyle = '#cccccc';
            context.strokeRect(
                this.pos.x,
                this.pos.y - this.textMetrics.fontBoundingBoxAscent,
                renderSize.width,
                renderSize.height
            );
        }

        applyStyle(context, this.style);
        context.fillText(this.text, this.pos.x, this.pos.y);
    }

    public isHit(pos: Position, radius: number): boolean {
        let position = this.pos;
        if (this.textMetrics) {
            position = {
                ...position,
                y: position.y - this.textMetrics.fontBoundingBoxAscent
            };
        }
        return checkHitAABB(pos, radius, position, this.getRenderSize());
    }

    public getType(): DrawElementType {
        return 'text';
    }

    public serialize(): SerializedDrawElement {
        return {
            id: this.id,
            type: 'text',
            style: this.style,
            data: {
                pos: this.pos,
                text: this.text
            }
        };
    }

    public static deserialize(element: SerializedDrawElement, highlight: boolean): AbstractDrawElement {
        return new TextElement(
            element.id,
            element.data.pos,
            element.data.text,
            element.style,
            highlight
        );
    }
}
