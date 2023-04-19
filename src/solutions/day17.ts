import { Solution } from "./Solution";
import { IntcodeVM } from "../intcode";
import { Vector2 } from "../utils/Vector2";
import { isDefined } from "../utils/typeHelpers";
import { TextDisplay } from "../utils/TextDisplay";

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
}

const palette = {
	[PaletteIndex.Scaffold]: {
		character: "#",
	},
	[PaletteIndex.Empty]: {
		character: ".",
	},
	[PaletteIndex.Intersection]: {
		character: "O",
	},
};

function solution1(program: string): number {
	const vm = new IntcodeVM();
	vm.loadProgram(program);
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
				display.paintCell(position, PaletteIndex.Scaffold);
				scaffold[position.toString()] = position.clone();
				break;
			default:
		}

		position.x++;
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
		console.log(position);
		sum += position.x * position.y;
	});

	console.log(display.render());

	return sum;
}

export default new Solution(17, solution1);
