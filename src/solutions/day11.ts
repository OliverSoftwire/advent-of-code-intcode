import { Solution } from "./Solution";
import { IntcodeVM } from "../intcode";
import { mod } from "../utils/mod";

type Vector = [number, number];

enum Direction {
	Up,
	Right,
	Down,
	Left,
}

const DIRECTIONS: Vector[] = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0],
];

class Robot {
	vm = new IntcodeVM();

	private position: Vector = [0, 0];
	private direction = Direction.Up;

	private map: Record<string, number> = {};

	private minPosition: Vector = [0, 0];
	private maxPosition: Vector = [0, 0];

	constructor(program: string, startOnWhite?: boolean) {
		this.vm.loadProgram(program);

		if (startOnWhite) {
			this.map[this.hashCurrentPosition()] = 1;
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
		let buffer = "";
		for (let y = this.minPosition[1]; y <= this.maxPosition[1]; y++) {
			for (let x = this.minPosition[0]; x <= this.maxPosition[0]; x++) {
				buffer += this.map[this.hashPosition([x, y])] ? "█" : " ";
			}
			buffer += "\n";
		}

		return buffer;
	}

	private getCurrentSquareColour() {
		return this.map[this.hashCurrentPosition()] ?? 0;
	}

	private paintSquare(colour: number) {
		this.map[this.hashCurrentPosition()] = colour;
	}

	private moveForwards() {
		const delta = DIRECTIONS[this.direction];

		this.position[0] += delta[0];
		this.position[1] += delta[1];

		this.minPosition[0] = Math.min(this.position[0], this.minPosition[0]);
		this.minPosition[1] = Math.min(this.position[1], this.minPosition[1]);

		this.maxPosition[0] = Math.max(this.position[0], this.maxPosition[0]);
		this.maxPosition[1] = Math.max(this.position[1], this.maxPosition[1]);
	}

	private hashCurrentPosition() {
		return this.hashPosition(this.position);
	}

	private hashPosition(position: Vector) {
		return `${position[0]},${position[1]}`;
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

export default new Solution("Day 11", solution1, solution2);
