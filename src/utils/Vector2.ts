export class Vector2 {
	constructor(public x: number, public y: number) {}

	add(b: Vector2): Vector2 {
		return new Vector2(this.x + b.x, this.y + b.y);
	}

	sub(b: Vector2): Vector2 {
		return new Vector2(this.x - b.x, this.y - b.y);
	}

	min(b: Vector2): Vector2 {
		return new Vector2(Math.min(this.x, b.x), Math.min(this.y, b.y));
	}

	max(b: Vector2): Vector2 {
		return new Vector2(Math.max(this.x, b.x), Math.max(this.y, b.y));
	}

	clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	toString(): string {
		return `(${this.x},${this.y})`;
	}
}
