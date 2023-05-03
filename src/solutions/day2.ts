import { IntcodeVM } from "../IntcodeVM";
import { Solution } from "./Solution";

function solution1(program: string) {
	const vm = new IntcodeVM();

	vm.loadProgramAndReset(program);
	vm.writeValueToMemory(1, 12);
	vm.writeValueToMemory(2, 2);

	vm.runUntilComplete();

	return vm.readValueFromMemory(0);
}

function solution2(program: string, output: number) {
	const vm = new IntcodeVM();

	vm.loadProgramAndReset(program);
	vm.runUntilComplete();

	const offset = vm.readValueFromMemory(0);

	vm.reset();
	vm.writeValueToMemory(1, 1);
	vm.runUntilComplete();

	const coefficient = vm.readValueFromMemory(0) - offset;

	const noun = Math.floor((output - offset) / coefficient);
	const verb = output - (coefficient * noun + offset);

	vm.reset();
	vm.writeValueToMemory(1, noun);
	vm.writeValueToMemory(2, verb);
	vm.runUntilComplete();

	if (vm.readValueFromMemory(0) !== output) {
		throw new Error("Inputs do not produce desired output");
	}

	return 100 * noun + verb;
}

export default new Solution(2, solution1, (input) =>
	solution2(input, 19690720)
);
