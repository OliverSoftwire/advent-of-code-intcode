import opcodes, { ParameterType } from "./opcodes";

enum ParameterMode {
	Position,
	Immediate,
	Relative,
}

class IntcodeError extends Error {
	constructor(vm: IntcodeVM, message: string) {
		super(
			`Error in Intcode VM at address ${vm.instructionPointer}: ${message}`
		);
	}
}

export class IntcodeVM {
	program: number[] = [];

	isHalted = true;

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
		this.isHalted = false;
		this.memory = [...this.program];
		this.instructionPointer = 0;
		this.instructionPointerModifiedThisCycle = false;
	}

	loadProgramAndReset(programData: string) {
		this.program = programData.split(",").map((int) => parseInt(int));
		this.reset();
	}

	step() {
		if (this.isHalted) {
			this.throwIntcodeError(
				"Program has finished running, cannot execute instruction"
			);
		}

		const opcodeId =
			this.readValueFromMemory(this.instructionPointer) % 100;
		const opcode = opcodes[opcodeId];
		if (!opcode) {
			this.throwIntcodeError(`Invalid opcode ${opcodeId}`);
		}

		const args = opcode.parameters.map(this.getArgForParameter());

		opcode.action(this, ...args);
		if (this.isHalted) {
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
		if (this.isHalted) {
			return undefined;
		}

		const prevOutputLen = this.outputBuffer.length;
		while (this.step() && this.outputBuffer.length === prevOutputLen) {}
		return this.isHalted ? undefined : this.outputBuffer.pop();
	}

	writeValueToMemory(address: number, value: number) {
		if (address < 0) {
			this.throwIntcodeError("Memory address must be positive");
		}

		this.memory[address] = value;
	}

	readValueFromMemory(address: number) {
		if (address < 0) {
			this.throwIntcodeError("Memory address must be positive");
		}

		return this.memory[address] ?? 0;
	}

	pushInputToBuffer(input: number) {
		this.inputBuffer.push(input);
	}

	popInputFromBuffer(): number | undefined {
		return this.inputBuffer.shift();
	}

	pushOutputToBuffer(output: number) {
		this.outputBuffer.push(output);
	}

	popOutputFromBuffer(): number | undefined {
		return this.outputBuffer.shift();
	}

	private decodeParameterModes(): ParameterMode[] {
		return Math.floor(
			this.readValueFromMemory(this.instructionPointer) / 100
		)
			.toString()
			.split("")
			.map(Number)
			.reverse();
	}

	private getArgForParameter() {
		const parameterModes = this.decodeParameterModes();

		return (parameter: ParameterType, index: number) => {
			const argument = this.readValueFromMemory(
				this.instructionPointer + 1 + index
			);

			const mode = parameterModes[index] ?? ParameterMode.Position;
			if (mode === ParameterMode.Immediate) {
				if (parameter === ParameterType.Write) {
					this.throwIntcodeError(
						"Cannot write to an immediate parameter"
					);
				}

				return argument;
			}

			const address = this.getAddressForParameter(mode, argument);
			return parameter === ParameterType.Read
				? this.readValueFromMemory(address)
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
				this.throwIntcodeError(
					"Cannot interpret immediate mode parameter as an address"
				);
			default:
				this.throwIntcodeError(`Invalid parameter mode ${mode}`);
		}
	}

	private throwIntcodeError(message: string): never {
		throw new IntcodeError(this, message);
	}
}
