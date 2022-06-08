import { Position } from '@/types';
import { CanvasDrawingContext, ITool } from './ITool';
import {
    AbstractDrawElement
} from '@/components/Whiteboard/elements/AbstractDrawElement';
import { getDeserializer } from '@/components/Whiteboard/registry';

export default function Eraser(): ITool {
    const findHitElement = (
        elements: AbstractDrawElement[],
        radius: number,
        pos: Position
    ) => {
        for (let i = elements.length - 1; i >= 0; i--) {
            if (elements[i].isHit(pos, radius)) {
                return elements[i];
            }
        }
        return undefined;
    };

    const eliminateNear = (ctx: CanvasDrawingContext, pos: Position) => {
        const hitElement = findHitElement(
            ctx.canvasContext.elements,
            ctx.canvasContext.brush.thickness,
            pos
        );
        if (hitElement) {
            ctx.removeDrawElement(hitElement.id);
        }
    };

    return {
        onMove: (ctx: CanvasDrawingContext, pos: Position) => {
            const hitElement = findHitElement(
                ctx.canvasContext.elements,
                ctx.canvasContext.brush.thickness,
                pos
            );
            ctx.setCanvasContext((prev) => ({
                ...prev,
                elements: prev.elements.map((element) => {
                    const highlight = element.id === hitElement?.id;
                    if (element.highlight === highlight) {
                        return element;
                    }
                    return getDeserializer(element.getType())(element.serialize(), highlight);
                })
            }));
        },

        getToolType: () => 'eraser',

        onPress: eliminateNear,

        onDrag: eliminateNear
    };
}
