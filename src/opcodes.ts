import { IntcodeVM } from "./intcode";

export type OpcodeFn = (vm: IntcodeVM, ...args: number[]) => void;

export interface Opcode {
	name: string;
	value: number;
	stride: number;
	action: OpcodeFn;
}

const opcodes: { [value: number]: Opcode } = {};

function opcode(name: string, value: number, action: OpcodeFn) {
	opcodes[value] = {
		name,
		value,
		stride: action.length, // No need to subtract 1 for vm, as we need to add 1 for the opcode itself
		action,
	};
}

opcode("ADD", 1, (vm, a, b, writeAddr) => {
	vm.memory[writeAddr] = a + b;
});
opcode("MUL", 2, (vm, a, b, writeAddr) => {
	vm.memory[writeAddr] = a * b;
});

opcode("IN", 3, (vm, writeAddr) => {});
opcode("OUT", 4, (vm, output) => {});

opcode("HALT", 99, (vm) => {
	vm.halted = true;
});

export default opcodes;
