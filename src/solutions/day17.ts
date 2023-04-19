import { Solution } from "./Solution";
import { IntcodeVM } from "../IntcodeVM";
import { Vector2 } from "../utils/Vector2";
import { isDefined } from "../utils/typeHelpers";
import { TextDisplay } from "../utils/TextDisplay";
import chalk from "chalk";

const DIRECTIONS: Vector2[] = [
	new Vector2(0, -1),
	new Vector2(1, 0),
	new Vector2(0, 1),
	new Vector2(-1, 0),
];

enum PaletteIndex {
	Intersection = 0,
	Scaffold = 35,
	Empty = 46,
	RobotUp = 94,
	RobotDown = 118,
	RobotLeft = 60,
	RobotRight = 62,
	RobotVoid = 88,
}

const robotColour = chalk.whiteBright;

const palette = {
	[PaletteIndex.Scaffold]: {
		character: "#",
		colour: chalk.hex("#943628"),
	},
	[PaletteIndex.Empty]: {
		character: ".",
		colour: chalk.grey,
	},
	[PaletteIndex.Intersection]: {
		character: "O",
		colour: chalk.greenBright,
	},
	[PaletteIndex.RobotUp]: {
		character: "^",
		colour: robotColour,
	},
	[PaletteIndex.RobotDown]: {
		character: "v",
		colour: robotColour,
	},
	[PaletteIndex.RobotLeft]: {
		character: "<",
		colour: robotColour,
	},
	[PaletteIndex.RobotRight]: {
		character: ">",
		colour: robotColour,
	},
	[PaletteIndex.RobotVoid]: {
		character: "X",
		colour: robotColour,
	},
};

function solution1(program: string): number {
	const vm = new IntcodeVM();
	vm.loadProgramAndReset(program);
	vm.runUntilComplete();

	const display = new TextDisplay<PaletteIndex>(palette, PaletteIndex.Empty);

	const scaffold: Record<string, Vector2> = {};
	const position = new Vector2(0, 0);

	vm.outputBuffer.forEach((output) => {
		switch (output) {
			case 10:
				position.x = 0;
				position.y++;
				break;
			case PaletteIndex.Scaffold:
				scaffold[position.toString()] = position.clone();
			default:
				display.paintCell(position, output);
				position.x++;
		}
	});

	let sum = 0;
	Object.values(scaffold).forEach((position) => {
		const isIntersection = DIRECTIONS.map(
			(direction) => scaffold[position.add(direction).toString()]
		).every(isDefined);

		if (!isIntersection) {
			return;
		}

		display.paintCell(position, PaletteIndex.Intersection);
		sum += position.x * position.y;
	});

	console.log(display.render());

	return sum;
}

export default new Solution(17, solution1);
