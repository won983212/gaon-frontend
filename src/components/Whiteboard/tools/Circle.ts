import { Position } from '@/types';
import { CircleElement } from '../elements/CircleElement';
import Vec from '@/util/vec';
import { CanvasDrawingContext, ITool } from '../tools/ITool';

export default function Circle(): ITool {
    return {
        onPress: (ctx: CanvasDrawingContext, pos: Position) => {
            ctx.setDrawingElement(
                new CircleElement(pos, 0, ctx.canvasContext.brush)
            );
        },

        onDrag: (ctx: CanvasDrawingContext, pos: Position) => {
            ctx.setDrawingElement((prev) => {
                const elem: CircleElement = prev as CircleElement;
                return new CircleElement(
                    elem.pos,
                    Vec.FromPosition(elem.pos)
                        .subtract(pos.x, pos.y)
                        .distance(),
                    elem.style,
                    elem.highlight
                );
            });
        },

        onRelease: (ctx: CanvasDrawingContext) => ctx.appendDrawingElement(),

        getToolType: () => 'circle'
    };
}
