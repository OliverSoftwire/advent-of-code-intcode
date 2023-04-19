import { Vector2 } from "./Vector2";
import { ChalkInstance } from "chalk";

export interface PaletteValue {
	character: string;
	colour?: ChalkInstance;
}

type Palette<PaletteIndex extends number> = {
	[K in PaletteIndex]: PaletteValue;
};

export class TextDisplay<PaletteIndex extends number> {
	private minCoord = new Vector2(0, 0);
	private maxCoord = new Vector2(0, 0);

	private cells: Record<string, PaletteIndex> = {};

	constructor(
		public readonly palette: Palette<PaletteIndex>,
		public readonly backgroundPaletteIndex: PaletteIndex
	) {}

	paintCell(coordinate: Vector2, value: PaletteIndex) {
		this.minCoord = this.minCoord.min(coordinate);
		this.maxCoord = this.maxCoord.max(coordinate);

		this.cells[this.hashCoordinate(coordinate)] = value;
	}

	render(): string {
		let buffer = "";
		for (let y = this.minCoord.y; y <= this.maxCoord.y; y++) {
			for (let x = this.minCoord.x; x <= this.maxCoord.x; x++) {
				const paletteIndex =
					this.cells[this.hashCoordinate(new Vector2(x, y))] ??
					this.backgroundPaletteIndex;

				const { character, colour } = this.palette[paletteIndex];

				buffer += colour ? colour(character) : character;
			}
			buffer += "\n";
		}

		return buffer;
	}

	private hashCoordinate(coordinate: Vector2): string {
		return `${coordinate.x},${coordinate.y}`;
	}
}
