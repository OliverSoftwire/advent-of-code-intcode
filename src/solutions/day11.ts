import { Solution } from "./Solution";
import { IntcodeVM } from "../intcode";
import { mod } from "../utils/mod";

enum Direction {
	Up,
	Right,
	Down,
	Left,
}

const DIRECTIONS = [
	[0, 1],
	[1, 0],
	[0, -1],
	[-1, 0],
];

class Robot {
	vm = new IntcodeVM();

	private position = [0, 0];
	private direction = Direction.Up;

	private map: Record<string, number> = {};

	constructor(program: string) {
		this.vm.loadProgram(program);
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

	private getCurrentSquareColour() {
		return this.map[this.hashPosition()] ?? 0;
	}

	private paintSquare(colour: number) {
		this.map[this.hashPosition()] = colour;
	}

	private moveForwards() {
		const delta = DIRECTIONS[this.direction];
		this.position[0] = this.position[0] + delta[0];
		this.position[1] = this.position[1] + delta[1];
	}

	private hashPosition() {
		return `${this.position[0]},${this.position[1]}`;
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

export default new Solution("Day 11", solution1);
