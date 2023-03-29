import fs from "fs";
import opcodes, { ParameterType } from "./opcodes";

enum ParameterMode {
	Position,
	Immediate,
	Relative,
}

export class IntcodeVM {
	program: number[] = [];

	halted = true;

	private memory: number[] = [];

	private _instructionPointer = 0;
	private instructionPointerModifiedThisCycle = false;
	get instructionPointer() {
		return this._instructionPointer;
	}
	set instructionPointer(value: number) {
		this._instructionPointer = value;
		this.instructionPointerModifiedThisCycle = true;
	}

	relativeBase = 0;

	inputBuffer: number[] = [];
	outputBuffer: number[] = [];

	constructor() {}

	reset() {
		this.halted = false;
		this.memory = [...this.program];
		this.instructionPointer = 0;
		this.instructionPointerModifiedThisCycle = false;
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

		const opcodeId = this.readMemory(this.instructionPointer) % 100;
		const opcode = opcodes[opcodeId];
		if (!opcode) {
			throw new Error(
				`Invalid opcode ${opcodeId} at position ${this.instructionPointer}`
			);
		}

		const parameterModes: ParameterMode[] = Math.floor(
			this.readMemory(this.instructionPointer) / 100
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

		if (!this.instructionPointerModifiedThisCycle) {
			this.instructionPointer += opcode.stride;
		}

		this.instructionPointerModifiedThisCycle = false;
		return true;
	}

	runUntilComplete() {
		while (this.step()) {}
		return [...this.memory];
	}

	runUntilOutput() {
		const prevOutputLen = this.outputBuffer.length;
		while (this.step() && this.outputBuffer.length === prevOutputLen) {}
		return [...this.memory];
	}

	writeMemory(address: number, value: number) {
		if (address < 0) {
			throw new Error("Memory address must be positive");
		}

		this.memory[address] = value;
	}

	readMemory(address: number) {
		if (address < 0) {
			throw new Error("Memory address must be positive");
		}

		return this.memory[address] ?? 0;
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
			const argument = this.readMemory(
				this.instructionPointer + 1 + index
			);

			const mode = parameterModes[index] ?? ParameterMode.Position;
			if (mode === ParameterMode.Immediate) {
				if (parameter === ParameterType.Write) {
					throw new Error("Cannot write to an immediate parameter");
				}

				return argument;
			}

			const address = this.getAddressForParameter(mode, argument);
			return parameter === ParameterType.Read
				? this.readMemory(address)
				: address;
		};
	}

	private getAddressForParameter(mode: ParameterMode, argument: number) {
		switch (mode) {
			case ParameterMode.Position:
				return argument;
			case ParameterMode.Relative:
				return this.relativeBase + argument;
			case ParameterMode.Immediate:
				throw new Error(
					"Cannot interpret immediate mode parameter as an address"
				);
			default:
				throw new Error(
					`Invalid parameter mode ${mode} at position ${this.instructionPointer}`
				);
		}
	}
}
