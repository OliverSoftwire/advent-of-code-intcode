import { IntcodeVM } from "intcode";
import { Solution } from "./Solution";

function solution1(program: string) {
	const vm = new IntcodeVM();

	vm.loadProgram(program);
	vm.memory[1] = 12;
	vm.memory[2] = 2;

	return vm.runUntilComplete()[0];
}

function solution2(program: string, output: number) {
	const vm = new IntcodeVM();

	vm.loadProgram(program);
	const offset = vm.runUntilComplete()[0];

	vm.reset();
	vm.memory[1] = 1;
	const coefficient = vm.runUntilComplete()[0] - offset;

	const noun = Math.floor((output - offset) / coefficient);
	const verb = output - (coefficient * noun + offset);

	vm.reset();
	vm.memory[1] = noun;
	vm.memory[2] = verb;
	if (vm.runUntilComplete()[0] !== output) {
		throw new Error("Inputs do not produce desired output");
	}

	return 100 * noun + verb;
}

export default new Solution("Day 2", solution1, (input) =>
	solution2(input, 19690720)
);
