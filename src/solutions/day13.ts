import _ from "lodash";
import { Solution } from "./Solution";
import { IntcodeVM } from "../IntcodeVM";
import { TextDisplay } from "../utils/TextDisplay";
import { Vector2 } from "../utils/Vector2";
import { sleep } from "../utils/sleep";
import chalk from "chalk";

enum PaletteIndex {
	Empty,
	Wall,
	Block,
	HorizontalPaddle,
	Ball,
	BlockRed,
	BlockOrange,
	BlockYellow,
	BlockGreen,
	BlockBlue,
	BlockPurple,
	BlockCyan,
}

const blockColours = [
	PaletteIndex.BlockRed,
	PaletteIndex.BlockOrange,
	PaletteIndex.BlockYellow,
	PaletteIndex.BlockGreen,
	PaletteIndex.BlockBlue,
	PaletteIndex.BlockPurple,
	PaletteIndex.BlockCyan,
];

const palette = {
	[PaletteIndex.Empty]: {
		character: " ",
	},
	[PaletteIndex.Wall]: {
		character: "▓",
		colour: chalk.grey.bgGrey,
	},
	[PaletteIndex.Block]: {
		character: "▃",
	},
	[PaletteIndex.HorizontalPaddle]: {
		character: "━",
		colour: chalk.blue,
	},
	[PaletteIndex.Ball]: {
		character: "◍",
	},
	[PaletteIndex.BlockRed]: {
		character: "▃",
		colour: chalk.red,
	},
	[PaletteIndex.BlockOrange]: {
		character: "▃",
		colour: chalk.hex("#fcba03"),
	},
	[PaletteIndex.BlockYellow]: {
		character: "▃",
		colour: chalk.yellow,
	},
	[PaletteIndex.BlockGreen]: {
		character: "▃",
		colour: chalk.green,
	},
	[PaletteIndex.BlockBlue]: {
		character: "▃",
		colour: chalk.blue,
	},
	[PaletteIndex.BlockPurple]: {
		character: "▃",
		colour: chalk.hex("#be03fc"),
	},
	[PaletteIndex.BlockCyan]: {
		character: "▃",
		colour: chalk.cyan,
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

enum JoystickPosition {
	Left = -1,
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
	private display = new TextDisplay<PaletteIndex>(
		palette,
		PaletteIndex.Empty
	);

	public paddlePosition = new Vector2(0, 0);
	public ballPosition = new Vector2(0, 0);
	public score = 0;

	private blocks: Record<string, boolean> = {};

	constructor(program: string, runWithQuarters?: boolean) {
		this.vm.loadProgramAndReset(program);

		if (runWithQuarters) {
			this.vm.writeValueToMemory(0, 2);
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
				const position = new Vector2(command.x, command.y);
				let paletteIndex = command.value;

				switch (command.value) {
					case PaletteIndex.HorizontalPaddle:
						this.paddlePosition = position;
						break;
					case PaletteIndex.Ball:
						this.ballPosition = position;
						break;
					case PaletteIndex.Block:
						this.blocks[position.toString()] = true;
						paletteIndex =
							blockColours[position.y % blockColours.length];
						break;
					case PaletteIndex.Empty:
						if (this.isBlockAtPosition(position)) {
							delete this.blocks[position.toString()];
						}
						break;
					default:
				}

				this.display.paintCell(position, paletteIndex);
				onPaint(command);
			}
		}
	}

	public pushJoystickPosition(joystickPosition: JoystickPosition): void {
		this.vm.pushInputToBuffer(joystickPosition);
	}

	public renderDisplay(): string {
		return this.display.render();
	}

	public isBlockAtPosition(position: Vector2): boolean {
		return this.blocks[position.toString()] ?? false;
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

async function solution2(program: string): Promise<number> {
	const cabinet = new Cabinet(program, true);

	const frames: string[] = [];

	let lastBallPosition = cabinet.ballPosition;
	cabinet.runWith(({ value }) => {
		if (value !== PaletteIndex.Ball) {
			return;
		}

		frames.push(cabinet.renderDisplay());

		if (cabinet.paddlePosition.x === cabinet.ballPosition.x) {
			const ballDelta = cabinet.ballPosition.sub(lastBallPosition);
			if (
				cabinet.isBlockAtPosition(
					cabinet.ballPosition.add(ballDelta)
				) ||
				cabinet.isBlockAtPosition(
					cabinet.ballPosition.add(new Vector2(ballDelta.x, 0))
				)
			) {
				ballDelta.x = -ballDelta.x;
			}

			if (ballDelta.x > 0) {
				cabinet.pushJoystickPosition(JoystickPosition.Right);
			} else {
				cabinet.pushJoystickPosition(JoystickPosition.Left);
			}
		} else {
			if (cabinet.paddlePosition.x > cabinet.ballPosition.x) {
				cabinet.pushJoystickPosition(JoystickPosition.Left);
			} else if (cabinet.paddlePosition.x < cabinet.ballPosition.x) {
				cabinet.pushJoystickPosition(JoystickPosition.Right);
			}
		}

		lastBallPosition = cabinet.ballPosition;
	});

	if (process.env.SHOW_ANIMATION) {
		for (const frame of frames) {
			console.clear();
			console.log(frame);
			await sleep((1 / 30) * 1000);
		}
	}

	return cabinet.score;
}

export default new Solution(13, solution1, solution2);
