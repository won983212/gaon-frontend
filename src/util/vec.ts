export default class Vec {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public add(x: number, y: number) {
        this.x += x;
        this.y += y;
    }

    public addVec(vec: Vec) {
        this.add(vec.x, vec.y);
    }

    public subtractVec(vec: Vec) {
        this.add(-vec.x, -vec.y);
    }

    public dot(vec: Vec) {
        return this.x * vec.x + this.y * vec.y;
    }

    public scale(scale: number) {
        this.x *= scale;
        this.y *= scale;
    }

    public sqDist() {
        return this.x * this.x + this.y * this.y;
    }

    public distance() {
        return Math.sqrt(this.sqDist());
    }
}
