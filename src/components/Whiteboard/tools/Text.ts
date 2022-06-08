import { CanvasDrawingContext, ITool, setDrawingElement } from './ITool';
import { Position } from '@/types';
import { drawTextCursor } from '@/components/Whiteboard/utils/RenderUtils';
import { TextElement } from '@/components/Whiteboard/elements/TextElement';

export default function Text(): ITool {
    return {
        renderCursor: (ctx: CanvasDrawingContext, mousePos: Position) => {
            const context2d = ctx.get2dContext();
            if (context2d) {
                drawTextCursor(context2d, mousePos);
            }
        },

        onPress: (ctx: CanvasDrawingContext, pos: Position) => {
            setDrawingElement(
                ctx,
                new TextElement(
                    ctx.generateNewId(),
                    pos,
                    '',
                    ctx.canvasContext.brush
                )
            );
        },

        getToolType: () => 'text'
    };
}
