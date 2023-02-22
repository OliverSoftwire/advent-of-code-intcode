import fs from "fs";

export class IntcodeVM {
	program: number[] = [];

	halted = true;

	memory: number[] = [];
	instructionPointer = 0;

	constructor() {}

	reset() {
		this.halted = false;
		this.memory = [...this.program];
		this.instructionPointer = 0;
	}

	loadProgram(programData: string) {
		this.program = programData.split(",").map((int) => parseInt(int));
		this.reset();
	}

	loadProgramFromFile(path: string) {
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
				throw `Invalid opcode ${opcode} at position ${this.instructionPointer}`;
		}

		this.instructionPointer += 4;
		return true;
	}

	runUntilComplete() {
		while (this.step()) {}
		return this.memory;
	}
}
