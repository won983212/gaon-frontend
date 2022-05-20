import { Position, Size } from '@/types';
import { BrushStyle } from '../types';
import { applyStyle } from '../utils/RenderUtils';
import { IDrawElement } from './IDrawElement';
import { checkHitAABB } from '@/components/Whiteboard/utils/CollisionDetectors';

export class TextElement implements IDrawElement {
    public readonly pos: Position; // top-left point
    public readonly text: string;
    public readonly style: BrushStyle;
    public readonly highlight: boolean;

    // 내부적으로만 사용됨. 불변성 유지할 필요 x
    private textMetrics: TextMetrics | undefined;

    public constructor(
        pos: Position,
        text: string,
        style: BrushStyle,
        highlight: boolean = false
    ) {
        this.pos = pos;
        this.text = text;
        this.style = style;
        this.highlight = highlight;
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
        return checkHitAABB(radius, pos, position, this.getRenderSize());
    }

    public setHighlight(highlight: boolean): IDrawElement {
        if (this.highlight === highlight) {
            return this;
        }
        return new TextElement(this.pos, this.text, this.style, highlight);
    }
}
