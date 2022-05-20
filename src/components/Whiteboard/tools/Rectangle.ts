import { Position } from '@/types';
import { RectangleElement } from '../elements/RectangleElement';
import { CanvasDrawingContext, ITool, setDrawingElement } from './ITool';

export default function Rectangle(): ITool {
    return {
        onPress: (ctx: CanvasDrawingContext, pos: Position) => {
            setDrawingElement(
                ctx,
                new RectangleElement(pos, pos, ctx.canvasContext.brush)
            );
        },

        onDrag: (ctx: CanvasDrawingContext, pos: Position) => {
            setDrawingElement<RectangleElement>(
                ctx,
                (prev) =>
                    new RectangleElement(
                        prev.pos1,
                        pos,
                        prev.style,
                        prev.highlight
                    )
            );
        },

        onRelease: (ctx: CanvasDrawingContext) => ctx.appendDrawingElement(),

        getToolType: () => 'rectangle'
    };
}
