import { IntcodeVM } from "intcode";

function solution1() {
	const vm = new IntcodeVM();
	vm.loadProgramFromFile("question.txt");
	vm.memory[1] = 12;
	vm.memory[2] = 2;
	console.log(vm.runUntilComplete()[0]);
}

function solution2(output: number) {
	const vm = new IntcodeVM();

	vm.loadProgramFromFile("question.txt");
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
		throw "Inputs do not produce desired output";
	}

	console.log(`Noun: ${noun}, verb: ${verb}`);
	console.log(`Solution: ${100 * noun + verb}`);
}

solution1();
solution2(19690720);
