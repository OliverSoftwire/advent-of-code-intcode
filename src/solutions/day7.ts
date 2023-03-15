import { IntcodeVM } from "intcode";
import { Solution } from "./Solution";

class Amplifier {
	private vm = new IntcodeVM();

	constructor(program: string) {
		this.vm.loadProgram(program);
	}

	run(phase: number, input: number): number {
		this.vm.writeInput(phase);
		this.vm.writeInput(input);

		this.vm.runUntilComplete();

		const out = this.vm.readOutput();
		if (out === undefined) {
			throw new Error("Output is undefined");
		}

		this.vm.reset();
		return out;
	}
}

export function runPhaseSequence(
	program: string,
	phaseSequence: number[]
): number {
	const amplifiers = phaseSequence.map(() => new Amplifier(program));

	return amplifiers.reduce(
		(input, amplifier, index) => amplifier.run(phaseSequence[index], input),
		0
	);
}

function solution1() {
	return 0;
}

export default new Solution("Day 7", solution1);
