import { PaintPath, PaintStyle } from '@/components/Whiteboard/DrawContext';
import { Position } from '@/types';

/**
 * Canvas Rendering Utils
 */

export function applyStyle(
    context: CanvasRenderingContext2D,
    style: PaintStyle
) {
    context.strokeStyle = style.color;
    context.lineWidth = style.thickness;
    context.lineJoin = 'round';
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

export function drawPath(context: CanvasRenderingContext2D, path: PaintPath) {
    const positions = path.path;
    if (path.style && positions.length > 0) {
        applyStyle(context, path.style);
        if (path.style.highlight) {
            context.strokeStyle = '#cccccc';
        }

        context.beginPath();
        context.moveTo(positions[0].x, positions[0].y);
        for (let i = 1; i < positions.length; i++) {
            context.lineTo(positions[i].x, positions[i].y);
        }
        context.stroke();
        context.closePath();
    }
}

export function drawCursor(context: CanvasRenderingContext2D, pos: Position) {
    context.globalCompositeOperation = 'xor';
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.lineJoin = 'round';

    context.beginPath();
    context.arc(pos.x, pos.y, 2, 0, 2 * Math.PI);
    context.stroke();
    context.closePath();

    context.globalCompositeOperation = 'source-over';
}
