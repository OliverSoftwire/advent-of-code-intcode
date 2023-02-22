import fs from "fs";
import opcodes from "./opcodes";

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
			throw new Error(
				"Program has finished running, cannot execute instruction"
			);
		}

		const opcode = opcodes[this.memory[this.instructionPointer] % 100];
		if (!opcode) {
			throw new Error(
				`Invalid opcode ${opcode} at position ${this.instructionPointer}`
			);
		}

		const input0 = this.memory[this.instructionPointer + 1];
		const input1 = this.memory[this.instructionPointer + 2];
		const output = this.memory[this.instructionPointer + 3];

		opcode.action(this, this.memory[input0], this.memory[input1], output);
		if (this.halted) {
			return false;
		}

		this.instructionPointer += opcode.stride;
		return true;
	}

	runUntilComplete() {
		while (this.step()) {}
		return this.memory;
	}
}
