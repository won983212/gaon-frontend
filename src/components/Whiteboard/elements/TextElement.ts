import { Position, Size } from '@/types';
import { BrushStyle } from '../types';
import { applyStyle } from '../RenderUtils';
import { IDrawElement } from './IDrawElement';
import { checkAABB } from '@/util/util';

export class TextElement implements IDrawElement {
    public readonly pos: Position; // top-left point
    public readonly text: string;
    public readonly style: BrushStyle;
    public readonly highlight: boolean;
    private renderSize: Size; // 내부적으로만 사용됨. 불변성 유지할 필요 x

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
        this.renderSize = { width: 0, height: 0 };
    }

    public draw(context: CanvasRenderingContext2D): void {
        const textMetrics = context.measureText(this.text);
        this.renderSize = {
            width: textMetrics.width,
            height:
                textMetrics.fontBoundingBoxAscent +
                textMetrics.fontBoundingBoxDescent
        };

        if (this.highlight) {
            context.strokeStyle = '#cccccc';
            context.strokeRect(
                this.pos.x,
                this.pos.y,
                this.renderSize.width,
                this.renderSize.height
            );
        }

        applyStyle(context, this.style);
        context.fillText(this.text, this.pos.x, this.pos.y);
    }

    public isHit(pos: Position, radius: number): boolean {
        return checkAABB(radius, pos, this.pos, this.renderSize);
    }

    public setHighlight(highlight: boolean): IDrawElement {
        if (this.highlight === highlight) {
            return this;
        }
        return new TextElement(this.pos, this.text, this.style, highlight);
    }
}
