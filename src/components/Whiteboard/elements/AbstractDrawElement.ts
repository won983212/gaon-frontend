import { Position } from '@/types';
import { BrushStyle, SerializedDrawElement } from '../types';
import { DrawElementType } from '@/components/Whiteboard/registry';

export type ElementIdentifier = string;

/** 보드에 그려질 수 있는 요소. 반드시 불변성을 유지해야함. */
export class AbstractDrawElement {
    public readonly id: ElementIdentifier;
    public readonly style: BrushStyle;
    public readonly highlight: boolean;

    public constructor(id: string, style: BrushStyle, highlight: boolean) {
        this.id = id;
        this.style = style;
        this.highlight = highlight;
    }

    /** 이 요소를 실제로 render한다. canvas context에 render */
    public draw(context: CanvasRenderingContext2D) {
        throw new Error('draw is not implemented.');
    }

    /**
     * <code>pos</code>를 중심으로 반지름이 <code>radius</code>인
     * 원과 닿아있으면 <code>true</code>리턴, 아니면 <code>false</code>리턴.
     */
    public isHit(pos: Position, radius: number): boolean {
        throw new Error('isHit is not implemented.');
    }

    public getType(): DrawElementType {
        throw new Error('getType is not implemented.');
    }

    /**
     * serialized object로 serialize
     */
    public serialize(): SerializedDrawElement {
        throw new Error('serialize is not implemented.');
    }

    /**
     * DrawElement로 deserialize하고, 새로운 element반환
     */
    public static deserialize(element: SerializedDrawElement, highlight: boolean): AbstractDrawElement {
        throw new Error('deserialize is not implemented.');
    }
}