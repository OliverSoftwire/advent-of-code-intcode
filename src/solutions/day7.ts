import { IntcodeVM } from "../IntcodeVM";
import { Solution } from "./Solution";
import { permuteArray } from "../utils/heapPermute";

class Amplifier {
	private vm = new IntcodeVM();

	constructor(program: string, phase: number) {
		this.vm.loadProgram(program);
		this.vm.writeInput(phase);
	}

	run(input: number): number | undefined {
		this.vm.writeInput(input);
		return this.vm.runUntilOutput();
	}
}

export function runPhaseSequence(
	program: string,
	phaseSequence: number[]
): number {
	const amplifiers = phaseSequence.map(
		(phase) => new Amplifier(program, phase)
	);

	return amplifiers.reduce((input, amplifier) => {
		const output = amplifier.run(input);
		if (output === undefined) {
			throw new Error("Amplifier terminated early");
		}

		return output;
	}, 0);
}

export function runPhaseSequenceWithFeedback(
	program: string,
	phaseSequence: number[]
): number {
	const amplifiers = phaseSequence.map(
		(phase) => new Amplifier(program, phase)
	);

	let lastOutput = 0;
	while (true) {
		const output = amplifiers.reduce(
			(input: number | undefined, amplifier) => {
				if (input === undefined) {
					return undefined;
				}

				return amplifier.run(input);
			},
			lastOutput
		);

		if (output === undefined) {
			break;
		}
		lastOutput = output;
	}

	return lastOutput;
}

function solution1(program: string) {
	const phaseSequences = permuteArray([0, 1, 2, 3, 4]);
	const results = phaseSequences.map((phaseSequence) =>
		runPhaseSequence(program, phaseSequence)
	);

	return Math.max(...results);
}

function solution2(program: string) {
	const phaseSequences = permuteArray([5, 6, 7, 8, 9]);
	const results = phaseSequences.map((phaseSequence) =>
		runPhaseSequenceWithFeedback(program, phaseSequence)
	);

	return Math.max(...results);
}

export default new Solution(7, solution1, solution2);
