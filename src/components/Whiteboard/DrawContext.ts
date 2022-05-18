import { Position } from '@/types';
import { ITool } from '@/components/Whiteboard/Tools';
import {
    applyStyle,
    clearBoard,
    drawCursor,
    drawPath
} from '@/components/Whiteboard/Renderers';

export interface PaintStyle {
    color: string;
    thickness: number;
    highlight: boolean;
}

/** 드래그해서 그린 하나의 선을 PaintPath로 정의함.
 * 향후 아이콘이나 template shape의 경우에는 더 확장해야할 것임. */
export interface PaintPath {
    path: Position[];
    style: PaintStyle;
}

interface StyleNullablePath {
    path: Position[];
    style: PaintStyle | undefined;
}

/**
 * 사용자가 그린 paint들을 관리하고, canvas에 실제로 render하는 클래스.
 */
export default class DrawContext {
    public paints: PaintPath[];
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    private currentPath: StyleNullablePath | undefined;
    private currentTool: ITool;
    private cameraPos: Position;
    private lastMousePos: Position;

    constructor(
        canvasRef: React.RefObject<HTMLCanvasElement>,
        initialTool: ITool
    ) {
        this.paints = [];
        this.canvasRef = canvasRef;
        this.currentTool = initialTool;
        this.cameraPos = { x: 0, y: 0 };
        this.lastMousePos = { x: 0, y: 0 };
    }

    private getContext() {
        if (!this.canvasRef.current) {
            return null;
        }
        return this.canvasRef.current.getContext('2d');
    }

    public setTool(tool: ITool) {
        this.currentTool = tool;
    }

    public getCameraPos() {
        return this.cameraPos;
    }

    public setCameraPos(pos: Position) {
        this.cameraPos = pos;
        this.repaint();
    }

    public repaint() {
        let context = this.getContext();
        if (context) {
            let camPos = this.cameraPos;
            clearBoard(this.canvasRef, context);
            context.translate(-camPos.x, -camPos.y);

            for (let paint of this.paints) {
                drawPath(context, paint);
            }

            if (this.currentPath && this.currentPath.style) {
                drawPath(context, {
                    path: this.currentPath.path,
                    style: this.currentPath.style
                });
            }

            context.translate(camPos.x, camPos.y);

            let shouldRenderCursor = true;
            if (this.currentTool.shouldRenderCursor) {
                shouldRenderCursor = this.currentTool.shouldRenderCursor(this);
            }
            if (shouldRenderCursor) {
                drawCursor(context, this.lastMousePos);
            }
        }
    }

    public clear() {
        this.paints = [];
        this.currentPath = undefined;

        let context = this.getContext();
        if (context) {
            clearBoard(this.canvasRef, context);
        }
    }

    public onPress(pos: Position) {
        const context = this.getContext();
        pos.x += this.cameraPos.x;
        pos.y += this.cameraPos.y;

        if (this.currentTool.onPress) {
            this.currentTool.onPress(this, pos);
        }

        let style;
        if (this.currentTool.createLineStyle) {
            style = this.currentTool.createLineStyle();
        }
        this.currentPath = { path: [pos], style: style };

        if (context && this.currentPath.style) {
            applyStyle(context, this.currentPath.style);
            context.beginPath();
            context.moveTo(pos.x - this.cameraPos.x, pos.y - this.cameraPos.y);
        }
    }

    public onMove(pos: Position, delta: Position) {
        if (this.lastMousePos !== pos) {
            this.lastMousePos = { x: pos.x, y: pos.y };
            this.repaint();
        }

        pos.x += this.cameraPos.x;
        pos.y += this.cameraPos.y;

        if (this.currentPath) {
            const context = this.getContext();
            if (this.currentTool.onDrag) {
                this.currentTool.onDrag(this, pos, delta);
            }

            let paths = this.currentPath.path;
            if (paths.length > 0) {
                let dx = paths[paths.length - 1].x - pos.x;
                let dy = paths[paths.length - 1].y - pos.y;
                if (dx * dx + dy * dy > 20) {
                    // sqrt(20)보다 이동거리가 짧으면 drawing요청 무시
                    paths.push(pos);
                }
            } else {
                paths.push(pos);
            }

            if (context && this.currentPath.style) {
                context.lineTo(
                    pos.x - this.cameraPos.x,
                    pos.y - this.cameraPos.y
                );
                context.stroke();
            }
        } else if (this.currentTool.onMove) {
            this.currentTool.onMove(this, pos);
        }
    }

    public onRelease() {
        if (this.currentPath) {
            const context = this.getContext();
            if (this.currentTool.onRelease) {
                let dragPath: PaintPath | Position[] = this.currentPath.path;
                if (this.currentPath.style) {
                    dragPath = {
                        path: this.currentPath.path,
                        style: this.currentPath.style
                    };
                }
                this.currentTool.onRelease(this, dragPath);
            }

            if (context && this.currentPath.style) {
                context.stroke();
                context.closePath();
            }

            this.currentPath = undefined;
            this.repaint();
        }
    }
}
