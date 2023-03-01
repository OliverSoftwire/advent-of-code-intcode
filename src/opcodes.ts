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

opcode("IN", 3, [ParameterType.Write], (vm, writeAddr) => {});
opcode("OUT", 4, [ParameterType.Read], (vm, output) => {});

opcode("HALT", 99, [], (vm) => {
	vm.halted = true;
});

export default opcodes;
