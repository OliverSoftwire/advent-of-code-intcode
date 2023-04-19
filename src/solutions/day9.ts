import { Solution } from "./Solution";
import { IntcodeVM } from "../IntcodeVM";

function solution1(program: string) {
	const vm = new IntcodeVM();

	vm.loadProgramAndReset(program);
	vm.pushInputToBuffer(1);

	vm.runUntilComplete();

	return vm.popOutputFromBuffer() ?? 0;
}

function solution2(program: string) {
	const vm = new IntcodeVM();

	vm.loadProgramAndReset(program);
	vm.pushInputToBuffer(2);

	vm.runUntilComplete();

	return vm.popOutputFromBuffer() ?? 0;
}

export default new Solution(9, solution1, solution2);
