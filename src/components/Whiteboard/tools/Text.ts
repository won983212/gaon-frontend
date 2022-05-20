import { CanvasDrawingContext, ITool } from './ITool';
import { Position } from '@/types';
import { drawTextCursor } from '@/components/Whiteboard/RenderUtils';
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
            ctx.setCanvasContext((prev) => ({
                ...prev,
                drawingElement: new TextElement(
                    pos,
                    '',
                    ctx.canvasContext.brush
                )
            }));
        },

        getToolType: () => 'text'
    };
}
