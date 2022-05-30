import { Position } from '@/types';
import { PathElement } from '../elements/PathElement';
import { CanvasDrawingContext, ITool, setDrawingElement } from './ITool';

export default function Pencil(): ITool {
    return {
        onPress: (ctx: CanvasDrawingContext, pos: Position) => {
            setDrawingElement(
                ctx,
                new PathElement(
                    ctx.generateNewId(),
                    [pos, pos],
                    ctx.canvasContext.brush
                )
            );
        },

        onDrag: (ctx: CanvasDrawingContext, pos: Position) => {
            const element = ctx.canvasContext.drawingElement as PathElement;
            if (!element) {
                return;
            }

            let newPosHolder: Position | undefined = undefined;
            if (element.path.length > 0) {
                let dx = element.path[element.path.length - 1].x - pos.x;
                let dy = element.path[element.path.length - 1].y - pos.y;
                if (dx * dx + dy * dy > 20) {
                    // sqrt(20)보다 이동거리가 짧으면 drawing요청 무시
                    newPosHolder = pos;
                }
            } else {
                newPosHolder = pos;
            }

            if (newPosHolder) {
                const newPos: Position = newPosHolder;
                setDrawingElement<PathElement>(
                    ctx,
                    (prev) =>
                        new PathElement(
                            prev.id,
                            prev.path.concat(newPos),
                            prev.style,
                            prev.highlight
                        )
                );
            }
        },

        onRelease: (ctx: CanvasDrawingContext) => ctx.appendDrawingElement(),

        getToolType: () => 'pencil'
    };
}
