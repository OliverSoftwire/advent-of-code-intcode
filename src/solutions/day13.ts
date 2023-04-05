import _ from "lodash";
import { Solution } from "./Solution";
import { IntcodeVM } from "../intcode";
import { TextDisplay } from "../utils/TextDisplay";
import { Vector2 } from "../utils/Vector2";

enum PaletteIndex {
	Empty,
	Wall,
	Block,
	HorizontalPaddle,
	Ball,
}

const palette = {
	[PaletteIndex.Empty]: {
		character: " ",
	},
	[PaletteIndex.Wall]: {
		character: "▓",
	},
	[PaletteIndex.Block]: {
		character: "▃",
	},
	[PaletteIndex.HorizontalPaddle]: {
		character: "━",
	},
	[PaletteIndex.Ball]: {
		character: "◍",
	},
};

interface PaintCommand {
	coordinate: Vector2;
	paletteIndex: PaletteIndex;
}

function getNextPaintCommand(vm: IntcodeVM): PaintCommand | undefined {
	const x = vm.runUntilOutput();
	const y = vm.runUntilOutput();
	const paletteIndex = vm.runUntilOutput();

	if (_.isUndefined(x) || _.isUndefined(y) || _.isUndefined(paletteIndex)) {
		return undefined;
	}

	return {
		coordinate: new Vector2(x, y),
		paletteIndex,
	};
}

function solution1(program: string): number {
	const vm = new IntcodeVM();
	vm.loadProgram(program);

	let numBlocks = 0;

	let command;
	while ((command = getNextPaintCommand(vm))) {
		if (command.paletteIndex === PaletteIndex.Block) {
			numBlocks++;
		}
	}

	return numBlocks;
}

export default new Solution(13, solution1);
