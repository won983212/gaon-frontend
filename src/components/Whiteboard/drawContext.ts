export default class DrawContext {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        let ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Can't get context from canvas!");
        this.context = ctx;
    }
}
