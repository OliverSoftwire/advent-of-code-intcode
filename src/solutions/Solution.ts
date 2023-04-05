import fs from "fs/promises";
import path from "path";

export type SolutionResultType = number | string;

export type SolutionPart = (input: string) => SolutionResultType;

export interface SolutionResult {
	part1: SolutionResultType;
	part2?: SolutionResultType;
}

export class Solution {
	constructor(
		public day: number,
		private readonly part1: SolutionPart,
		private readonly part2?: SolutionPart
	) {
		this.part1 = part1;
		this.part2 = part2;
	}

	public async runPart1(): Promise<SolutionResultType> {
		return this.part1(await this.getPuzzleInput());
	}

	public async runPart2(): Promise<SolutionResultType | undefined> {
		return this.part2?.(await this.getPuzzleInput());
	}

	public async run(): Promise<SolutionResult> {
		return {
			part1: await this.runPart1(),
			part2: await this.runPart2(),
		};
	}

	private async getPuzzleInput(): Promise<string> {
		const fileContents = await fs.readFile(
			path.join("questions", `Day ${this.day}.txt`)
		);

		return fileContents.toString();
	}
}
