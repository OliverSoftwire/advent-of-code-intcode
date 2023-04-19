import { IntcodeVM } from "./IntcodeVM";

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
	if (opcodes[value]) {
		throw new Error(
			`Opcode ${value} has already been defined as ${opcodes[value].name}, cannot redefine as ${name}`
		);
	}
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
		vm.writeValueToMemory(writeAddr, a + b);
	}
);
opcode(
	"MUL",
	2,
	[ParameterType.Read, ParameterType.Read, ParameterType.Write],
	(vm, a, b, writeAddr) => {
		vm.writeValueToMemory(writeAddr, a * b);
	}
);

opcode("IN", 3, [ParameterType.Write], (vm, writeAddr) => {
	const input = vm.popInputFromBuffer();
	if (input === undefined) {
		throw new Error("Failed to read input, buffer is empty");
	}

	vm.writeValueToMemory(writeAddr, input);
});
opcode("OUT", 4, [ParameterType.Read], (vm, output) => {
	vm.pushOutputToBuffer(output);
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
		vm.writeValueToMemory(output, a < b ? 1 : 0);
	}
);

opcode(
	"EQUALS",
	8,
	[ParameterType.Read, ParameterType.Read, ParameterType.Write],
	(vm, a, b, output) => {
		vm.writeValueToMemory(output, a === b ? 1 : 0);
	}
);

opcode("RELATIVE_BASE_OFFSET", 9, [ParameterType.Read], (vm, offset) => {
	vm.relativeBase += offset;
});

opcode("HALT", 99, [], (vm) => {
	vm.isHalted = true;
});

export default opcodes;
