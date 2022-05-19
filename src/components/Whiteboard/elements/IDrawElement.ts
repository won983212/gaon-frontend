import { Position } from '@/types';
import { BrushStyle } from '../types';

/** 보드에 그려질 수 있는 요소. 반드시 불변성을 유지해야함. */
export interface IDrawElement {
    readonly style: BrushStyle;
    readonly highlight: boolean;

    /** 이 요소를 실제로 render한다. canvas context에 render */
    draw: (context: CanvasRenderingContext2D) => void;

    /**
     * <code>pos</code>를 중심으로 반지름이 <code>radius</code>인
     * 원과 닿아있으면 <code>true</code>리턴, 아니면 <code>false</code>리턴.
     */
    isHit: (pos: Position, radius: number) => boolean;

    /**
     * highlight를 설정한 새로운 object를 반환한다.
     * highlight가 바뀌지 않았을 경우에는 this를 반환한다.
     */
    setHighlight: (highlight: boolean) => IDrawElement;
}
