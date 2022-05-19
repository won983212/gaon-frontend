import { Position } from '@/types';
import { CanvasDrawingContext, ITool } from './ITool';

export default function Eraser(): ITool {
    const eliminateNear = (ctx: CanvasDrawingContext, pos: Position) => {
        const radius = ctx.canvasContext.brush.thickness;
        ctx.setCanvasContext((prev) => ({
            ...prev,
            elements: prev.elements.filter(
                (element) => !element.isHit(pos, radius)
            )
        }));
    };

    return {
        onMove: (ctx: CanvasDrawingContext, pos: Position) => {
            const radius = ctx.canvasContext.brush.thickness;
            ctx.setCanvasContext((prev) => ({
                ...prev,
                elements: prev.elements.map((element) => {
                    if (element.isHit(pos, radius)) {
                        return element.setHighlight(true);
                    }
                    return element.setHighlight(false);
                })
            }));
        },

        getToolType: () => 'eraser',

        onPress: eliminateNear,

        onDrag: eliminateNear
    };
}
