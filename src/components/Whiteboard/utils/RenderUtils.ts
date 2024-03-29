import { Position } from '@/types';
import { BrushStyle } from '@/components/Whiteboard/types';

/**
 * Canvas Rendering Utils
 */

export function applyStyle(
    context: CanvasRenderingContext2D,
    style: BrushStyle
) {
    context.strokeStyle = style.strokeStyle;
    context.fillStyle = style.fillStyle;
    context.lineWidth = style.thickness;
    context.lineJoin = 'round';
    context.lineCap = 'round';
}

export function clearBoard(
    canvasRef: React.RefObject<HTMLCanvasElement>,
    context: CanvasRenderingContext2D
) {
    if (canvasRef.current) {
        context.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
        );
    }
}

export function drawCursor(
    context: CanvasRenderingContext2D,
    radius: number,
    pos: Position
) {
    context.globalCompositeOperation = 'xor';
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.lineJoin = 'round';

    context.beginPath();
    context.arc(pos.x, pos.y, radius / 2, 0, 2 * Math.PI);
    context.stroke();
    context.closePath();

    context.globalCompositeOperation = 'source-over';
}

export function drawTextCursor(
    context: CanvasRenderingContext2D,
    pos: Position
) {
    context.globalCompositeOperation = 'xor';
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.lineJoin = 'round';

    context.beginPath();
    context.moveTo(pos.x - 4, pos.y - 8);
    context.lineTo(pos.x + 4, pos.y - 8);
    context.moveTo(pos.x, pos.y - 8);
    context.lineTo(pos.x, pos.y + 8);
    context.moveTo(pos.x - 4, pos.y + 8);
    context.lineTo(pos.x + 4, pos.y + 8);
    context.stroke();
    context.closePath();

    context.globalCompositeOperation = 'source-over';
}
