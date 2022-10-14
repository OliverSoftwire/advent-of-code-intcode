const fs = require("fs");
const { builtinModules } = require("module");

class IntcodeVM {
	program = [];

	halted = true;

	memory = [];
	instructionPointer = 0;

	constructor() {}

	reset() {
		this.halted = false;
		this.memory = [...this.program];
		this.instructionPointer = 0;
	}

	loadProgram(programData) {
		this.program = programData.split(",").map(int => parseInt(int));
		this.reset();
	}

	loadProgramFromFile(path) {
		const programData = fs.readFileSync(path);
		this.loadProgram(programData.toString());
	}

	step() {
		if (this.halted) {
			throw "Program has finished running, cannot execute instruction";
		}

		const opcode = this.memory[this.instructionPointer];
		const input0 = this.memory[this.instructionPointer + 1];
		const input1 = this.memory[this.instructionPointer + 2];
		const output = this.memory[this.instructionPointer + 3];

		switch (opcode) {
			case 1:
				this.memory[output] = this.memory[input0] + this.memory[input1];
				break;
			case 2:
				this.memory[output] = this.memory[input0] * this.memory[input1];
				break;
			case 99:
				this.halted = true;
				return false;
			default:
				throw `Invalid opcode ${opcode} at position ${this.instructionPointer}`
		}

		this.instructionPointer += 4;
		return true;
	}

	runUntilComplete() {
		while (this.step()) {}
		return this.memory;
	}
}

exports.IntcodeVM = IntcodeVM;

function solution1() {
	const vm = new IntcodeVM();
	vm.loadProgramFromFile("question.txt");
	vm.memory[1] = 12
	vm.memory[2] = 2
	console.log(vm.runUntilComplete()[0]);
}

function solution2(output) {
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
		throw "Inputs do not produce desired output"
	};

	console.log(`Noun: ${noun}, verb: ${verb}`);
	console.log(`Solution: ${100 * noun + verb}`);
}

//solution1();
//solution2(19690720);
