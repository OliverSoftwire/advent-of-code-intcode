import { IntcodeVM } from "intcode";
import { Solution } from "./Solution";

function solution1(program: string) {
	const vm = new IntcodeVM();

	vm.loadProgram(program);
	vm.writeInput(1);

	vm.runUntilComplete();

	const diagnosticCode = vm.outputBuffer.pop();
	if (diagnosticCode === undefined) {
		throw new Error("No output was received");
	}

	vm.outputBuffer.forEach((output) => {
		if (output !== 0) {
			throw new Error("Tests did not pass");
		}
	});

	return diagnosticCode;
}

function solution2(program: string) {
	const vm = new IntcodeVM();

	vm.loadProgram(program);
	vm.writeInput(5);

	vm.runUntilComplete();

	const diagnosticCode = vm.readOutput();
	if (diagnosticCode === undefined) {
		throw new Error("No output was received");
	}

	return diagnosticCode;
}

export default new Solution(5, solution1, solution2);
