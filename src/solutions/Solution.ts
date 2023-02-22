import fs from "fs";
import path from "path";

export type SolutionResultType = number;

export type SolutionPart = (input: string) => SolutionResultType;

export interface SolutionResult {
	part1: SolutionResultType;
	part2?: SolutionResultType;
}

export class Solution {
	name: string;
	input: string;

	part1: SolutionPart;
	part2?: SolutionPart;

	constructor(name: string, part1: SolutionPart, part2?: SolutionPart) {
		this.name = name;
		this.input = fs
			.readFileSync(path.join("questions", this.name + ".txt"))
			.toString();

		this.part1 = part1;
		this.part2 = part2;
	}

	public run(): SolutionResult {
		return {
			part1: this.part1(this.input),
			part2: this.part2?.(this.input),
		};
	}
}
