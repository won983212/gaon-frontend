// 전역으로 자주 사용되는(될만한) type들만

export interface BrushStyle {
    strokeStyle: string;
    fillStyle: string;
    thickness: number;
}

export type ToolType =
    | 'pencil'
    | 'eraser'
    | 'move'
    | 'rectangle'
    | 'circle'
    | 'text'
    | 'image';
