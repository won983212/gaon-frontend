import { Position } from '@/types';
import { CanvasDrawingContext, ITool } from './ITool';

export default function Move(): ITool {
    return {
        renderCursor: () => {},

        onDrag: (ctx: CanvasDrawingContext, pos: Position, delta: Position) => {
            ctx.setCanvasContext((prev) => ({
                ...ctx.canvasContext,
                camPos: {
                    x: prev.camPos.x - delta.x / prev.zoom,
                    y: prev.camPos.y - delta.y / prev.zoom
                }
            }));
        },

        getToolType: () => 'move'
    };
}
