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

interface Command {
	x: number;
	y: number;
	value: number;
}

interface PaintCommand extends Command {
	value: PaletteIndex;
}

interface ScoreCommand extends Command {
	x: -1;
	y: 0;
}

enum JoystickCommands {
	Left = -1,
	Neutral = 0,
	Right = 1,
}

function commandIsPaintCommand(command: Command): command is PaintCommand {
	return Object.values(PaletteIndex).includes(command.value);
}

function commandIsScoreCommand(command: Command): command is ScoreCommand {
	return command.x === -1 && command.y === 0;
}

class Cabinet {
	private vm = new IntcodeVM();

	private paddlePosition = new Vector2(0, 0);
	public score = 0;

	constructor(program: string, runWithQuarters?: boolean) {
		this.vm.loadProgram(program);

		if (runWithQuarters) {
			this.vm.writeMemory(0, 2);
		}
	}

	public runWith(onPaint: (command: PaintCommand) => void) {
		let command;
		while ((command = this.getNextCommand())) {
			if (commandIsScoreCommand(command)) {
				this.score = command.value;
				continue;
			}

			if (commandIsPaintCommand(command)) {
				if (command.value === PaletteIndex.HorizontalPaddle) {
					this.paddlePosition = new Vector2(command.x, command.y);
				}

				onPaint(command);
			}
		}
	}

	private getNextCommand(): Command | undefined {
		const x = this.vm.runUntilOutput();
		const y = this.vm.runUntilOutput();
		const value = this.vm.runUntilOutput();

		if (_.isUndefined(x) || _.isUndefined(y) || _.isUndefined(value)) {
			return undefined;
		}

		return {
			x,
			y,
			value,
		};
	}
}

function solution1(program: string): number {
	const cabinet = new Cabinet(program);

	let numBlocks = 0;
	cabinet.runWith(({ value }) => {
		if (value === PaletteIndex.Block) {
			numBlocks++;
		}
	});

	return numBlocks;
}

function solution2(program: string): number {
	const cabinet = new Cabinet(program, true);

	cabinet.runWith(({ x, y, value }) => {});

	return cabinet.score;
}

export default new Solution(13, solution1, solution2);
