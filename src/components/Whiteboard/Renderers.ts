import { PaintPath, PaintStyle } from '@/components/Whiteboard/DrawContext';

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
        context.beginPath();
        context.moveTo(positions[0].x, positions[0].y);
        for (let i = 1; i < positions.length; i++) {
            context.lineTo(positions[i].x, positions[i].y);
        }
        context.stroke();
        context.closePath();
    }
}

export function drawGrid(ctx: CanvasRenderingContext2D) {
    ctx.moveTo(1, 1);
}
