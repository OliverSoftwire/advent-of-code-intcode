import { Solution } from "./Solution";
import { IntcodeVM } from "../IntcodeVM";

function solution1(program: string) {
	const vm = new IntcodeVM();

	vm.loadProgram(program);
	vm.writeInput(1);

	vm.runUntilComplete();

	return vm.readOutput() ?? 0;
}

function solution2(program: string) {
	const vm = new IntcodeVM();

	vm.loadProgram(program);
	vm.writeInput(2);

	vm.runUntilComplete();

	return vm.readOutput() ?? 0;
}

export default new Solution(9, solution1, solution2);
