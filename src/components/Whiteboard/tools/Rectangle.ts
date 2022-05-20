import { Position } from '@/types';
import { RectangleElement } from '../elements/RectangleElement';
import { CanvasDrawingContext, ITool } from './ITool';

export default function Rectangle(): ITool {
    return {
        onPress: (ctx: CanvasDrawingContext, pos: Position) => {
            ctx.setCanvasContext((prev) => ({
                ...prev,
                drawingElement: new RectangleElement(
                    pos,
                    pos,
                    ctx.canvasContext.brush
                )
            }));
        },

        onDrag: (ctx: CanvasDrawingContext, pos: Position) => {
            ctx.setCanvasContext((prev) => {
                const elem: RectangleElement =
                    prev.drawingElement as RectangleElement;
                return {
                    ...prev,
                    drawingElement: new RectangleElement(
                        elem.pos1,
                        pos,
                        elem.style,
                        elem.highlight
                    )
                };
            });
        },

        onRelease: (ctx: CanvasDrawingContext) => ctx.appendDrawingElement(),

        getToolType: () => 'rectangle'
    };
}
