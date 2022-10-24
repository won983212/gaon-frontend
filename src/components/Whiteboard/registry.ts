import Pencil from '@/components/Whiteboard/tools/Pencil';
import Eraser from '@/components/Whiteboard/tools/Eraser';
import Move from '@/components/Whiteboard/tools/Move';
import Line from '@/components/Whiteboard/tools/Line';
import Rectangle from '@/components/Whiteboard/tools/Rectangle';
import Circle from '@/components/Whiteboard/tools/Circle';
import Text from '@/components/Whiteboard/tools/Text';
import { PathElement } from '@/components/Whiteboard/elements/PathElement';
import { CircleElement } from '@/components/Whiteboard/elements/CircleElement';
import { LineElement } from '@/components/Whiteboard/elements/LineElement';
import { RectangleElement } from '@/components/Whiteboard/elements/RectangleElement';
import { TextElement } from '@/components/Whiteboard/elements/TextElement';


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

export const fillColors = [
    'transparent',
    '#feee9e',
    '#ccecf7',
    '#e4d1ee',
    '#fed6d6',
    '#fde0cf',
    '#e5f3cc',
    '#ebebeb',
    '#cccccc',
    '#1f1f1f'
];

export const strokeColors = [
    'transparent',
    '#feee9e',
    '#ccecf7',
    '#e4d1ee',
    '#fed6d6',
    '#fde0cf',
    '#e5f3cc',
    '#ebebeb',
    '#cccccc',
    '#1f1f1f'
];

export const strokeThickness = [1, 2, 3, 4, 6, 8, 10];

/**
 * tooltype에 대응되는 툴 함수를 생성함.
 */
export const getToolFromType = (tool: ToolType) => {
    switch (tool) {
        case 'pencil':
            return Pencil();
        case 'eraser':
            return Eraser();
        case 'move':
            return Move();
        case 'line':
            return Line();
        case 'rectangle':
            return Rectangle();
        case 'circle':
            return Circle();
        case 'text':
            return Text();
        default:
            throw new Error('unknown tool: ' + tool);
    }
};

/**
 * type에 대응되는 Deserializer를 반환.
 * Deserializer는 json으로 parse된 object로 부터 DrawElement를 만드는 함수임.
 */
export function getDeserializer(type: DrawElementType) {
    switch (type) {
        case 'path':
            return PathElement.deserialize;
        case 'circle':
            return CircleElement.deserialize;
        case 'line':
            return LineElement.deserialize;
        case 'rectangle':
            return RectangleElement.deserialize;
        case 'text':
            return TextElement.deserialize;
    }
}