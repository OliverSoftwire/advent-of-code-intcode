import { Solution } from "./Solution";
import { IntcodeVM } from "../intcode";
import { mod } from "../utils/mod";
import { Vector2 } from "../utils/Vector2";
import { TextDisplay } from "../utils/TextDisplay";

enum Direction {
	Up,
	Right,
	Down,
	Left,
}

const DIRECTIONS: Vector2[] = [
	new Vector2(0, -1),
	new Vector2(1, 0),
	new Vector2(0, 1),
	new Vector2(-1, 0),
];

enum PaletteIndex {
	Black,
	White,
}

const palette = {
	[PaletteIndex.Black]: {
		character: " ",
	},
	[PaletteIndex.White]: {
		character: "█",
	},
};

class Robot {
	vm = new IntcodeVM();
	display = new TextDisplay<PaletteIndex>(palette, PaletteIndex.Black);

	private position: Vector2 = new Vector2(0, 0);
	private direction = Direction.Up;

	private map: Record<string, number> = {};

	constructor(program: string, startOnWhite?: boolean) {
		this.vm.loadProgram(program);

		if (startOnWhite) {
			this.paintSquare(1);
		}
	}

	paintSquares() {
		while (true) {
			this.vm.writeInput(this.getCurrentSquareColour());

			const colourToPaint = this.vm.runUntilOutput();
			const directionToTurn = this.vm.runUntilOutput();
			if (colourToPaint === undefined || directionToTurn === undefined) {
				break;
			}

			this.paintSquare(colourToPaint);

			if (directionToTurn === 0) {
				this.rotateLeft();
			} else {
				this.rotateRight();
			}

			this.moveForwards();
		}
	}

	getPaintedSquares() {
		return Object.values(this.map).length;
	}

	renderImage() {
		return this.display.render();
	}

	private getCurrentSquareColour() {
		return this.map[this.hashCurrentPosition()] ?? 0;
	}

	private paintSquare(colour: number) {
		this.map[this.hashCurrentPosition()] = colour;
		this.display.paintCell(
			this.position,
			colour === 0 ? PaletteIndex.Black : PaletteIndex.White
		);
	}

	private moveForwards() {
		const delta = DIRECTIONS[this.direction];
		this.position = this.position.add(delta);
	}

	private hashCurrentPosition() {
		return `${this.position.x},${this.position.y}`;
	}

	private rotateLeft() {
		this.rotate(-1);
	}

	private rotateRight() {
		this.rotate(1);
	}

	private rotate(amount: number) {
		this.direction = mod(this.direction + amount, 4);
	}
}

function solution1(program: string) {
	const robot = new Robot(program);
	robot.paintSquares();

	return robot.getPaintedSquares();
}

function solution2(program: string) {
	const robot = new Robot(program, true);
	robot.paintSquares();

	return robot.renderImage();
}

export default new Solution(11, solution1, solution2);
