import { Position } from '@/types';
import { CanvasDrawingContext, ITool, setDrawingElement } from '../tools/ITool';
import { LineElement } from '@/components/Whiteboard/elements/LineElement';

export default function Line(): ITool {
    return {
        onPress: (ctx: CanvasDrawingContext, pos: Position) => {
            setDrawingElement(
                ctx,
                new LineElement(pos, pos, ctx.canvasContext.brush)
            );
        },

        onDrag: (ctx: CanvasDrawingContext, pos: Position) => {
            setDrawingElement<LineElement>(
                ctx,
                (prev) =>
                    new LineElement(prev.pos1, pos, prev.style, prev.highlight)
            );
        },

        onRelease: (ctx: CanvasDrawingContext) => {
            const line: LineElement = ctx.canvasContext
                .drawingElement as LineElement;
            if (line && line.pos1 !== line.pos2) {
                ctx.appendDrawingElement();
            }
        },

        getToolType: () => 'line'
    };
}
