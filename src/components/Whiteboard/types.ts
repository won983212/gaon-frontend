// 전역으로 자주 사용되는(될만한) type들만

import { Position } from '@/types';
import {
    AbstractDrawElement,
    ElementIdentifier
} from '@/components/Whiteboard/elements/AbstractDrawElement';

export interface BrushStyle {
    strokeStyle: string;
    fillStyle: string;
    thickness: number;
}

export type ToolType =
    | 'pencil'
    | 'eraser'
    | 'move'
    | 'line'
    | 'rectangle'
    | 'circle'
    | 'text'
    | 'image';

export type DrawElementType = 'path' | 'line' | 'circle' | 'rectangle' | 'text';

export interface CanvasContext {
    tool: ToolType;
    brush: BrushStyle;
    camPos: Position;
    zoom: number;
    elements: AbstractDrawElement[];
    drawingElement: AbstractDrawElement | undefined;
}

export interface SerializedDrawElement {
    id: ElementIdentifier;
    type: DrawElementType;
    style: BrushStyle;
}
