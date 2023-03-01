import fs from "fs";
import opcodes, { ParameterType } from "./opcodes";

enum ParameterMode {
	Position,
	Immediate,
}

export class IntcodeVM {
	program: number[] = [];

	halted = true;

	memory: number[] = [];
	instructionPointer = 0;

	inputBuffer: number[] = [];
	outputBuffer: number[] = [];

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

		const parameterModes: ParameterMode[] = Math.floor(
			this.memory[this.instructionPointer] / 100
		)
			.toString()
			.split("")
			.map(Number)
			.reverse();

		const args = opcode.parameters.map(
			this.getArgForParameter(parameterModes)
		);

		opcode.action(this, ...args);
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

	writeInput(input: number) {
		this.inputBuffer.push(input);
	}

	readInput(): number | undefined {
		return this.inputBuffer.shift();
	}

	writeOutput(output: number) {
		this.outputBuffer.push(output);
	}

	readOutput(): number | undefined {
		return this.outputBuffer.shift();
	}

	private getArgForParameter(parameterModes: ParameterMode[]) {
		return (parameter: ParameterType, index: number) => {
			const argument = this.memory[this.instructionPointer + 1 + index];

			if (parameter === ParameterType.Write) {
				return argument;
			}

			const mode = parameterModes[index] ?? ParameterMode.Position;
			switch (mode) {
				case ParameterMode.Position:
					return this.memory[argument];
				case ParameterMode.Immediate:
					return argument;
				default:
					throw new Error(
						`Invalid parameter mode ${mode} at position ${this.instructionPointer}`
					);
			}
		};
	}
}
