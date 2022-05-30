import { Position } from '@/types';
import { CircleElement } from '../elements/CircleElement';
import Vec from '@/util/vec';
import { CanvasDrawingContext, ITool, setDrawingElement } from '../tools/ITool';

export default function Circle(): ITool {
    return {
        onPress: (ctx: CanvasDrawingContext, pos: Position) => {
            setDrawingElement(
                ctx,
                new CircleElement(
                    ctx.generateNewId(),
                    pos,
                    0,
                    ctx.canvasContext.brush
                )
            );
        },

        onDrag: (ctx: CanvasDrawingContext, pos: Position) => {
            setDrawingElement<CircleElement>(
                ctx,
                (prev) =>
                    new CircleElement(
                        prev.id,
                        prev.pos,
                        Vec.FromPosition(prev.pos)
                            .subtract(pos.x, pos.y)
                            .distance(),
                        prev.style,
                        prev.highlight
                    )
            );
        },

        onRelease: (ctx: CanvasDrawingContext) => ctx.appendDrawingElement(),

        getToolType: () => 'circle'
    };
}
