import { IntcodeVM } from "./intcode";

export type OpcodeFn = (vm: IntcodeVM, ...args: number[]) => void;

export enum ParameterType {
	Read,
	Write,
}

export interface Opcode {
	name: string;
	value: number;
	stride: number;
	parameters: ParameterType[];
	action: OpcodeFn;
}

const opcodes: { [value: number]: Opcode } = {};

function opcode<NumParameters extends number>(
	name: string,
	value: number,
	parameters: ParameterType[],
	action: OpcodeFn
) {
	opcodes[value] = {
		name,
		value,
		parameters,
		stride: parameters.length + 1,
		action,
	};
}

opcode(
	"ADD",
	1,
	[ParameterType.Read, ParameterType.Read, ParameterType.Write],
	(vm, a, b, writeAddr) => {
		vm.memory[writeAddr] = a + b;
	}
);
opcode(
	"MUL",
	2,
	[ParameterType.Read, ParameterType.Read, ParameterType.Write],
	(vm, a, b, writeAddr) => {
		vm.memory[writeAddr] = a * b;
	}
);

opcode("IN", 3, [ParameterType.Write], (vm, writeAddr) => {
	const input = vm.readInput();
	if (input === undefined) {
		throw new Error("Failed to read input, buffer is empty");
	}

	vm.memory[writeAddr] = input;
});
opcode("OUT", 4, [ParameterType.Read], (vm, output) => {
	vm.writeOutput(output);
});

opcode(
	"JUMP_TRUE",
	5,
	[ParameterType.Read, ParameterType.Read],
	(vm, valueToCheck, newAddress) => {
		if (valueToCheck !== 0) {
			vm.instructionPointer = newAddress;
		}
	}
);

opcode(
	"JUMP_FALSE",
	6,
	[ParameterType.Read, ParameterType.Read],
	(vm, valueToCheck, newAddress) => {
		if (valueToCheck === 0) {
			vm.instructionPointer = newAddress;
		}
	}
);

opcode(
	"LESS_THAN",
	7,
	[ParameterType.Read, ParameterType.Read, ParameterType.Write],
	(vm, a, b, output) => {
		vm.memory[output] = a < b ? 1 : 0;
	}
);

opcode(
	"EQUALS",
	7,
	[ParameterType.Read, ParameterType.Read, ParameterType.Write],
	(vm, a, b, output) => {
		vm.memory[output] = a === b ? 1 : 0;
	}
);

opcode("HALT", 99, [], (vm) => {
	vm.halted = true;
});

export default opcodes;
