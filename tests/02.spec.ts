import { IntcodeVM } from "intcode";

describe("Day 2", () => {
	it("should pass the example program", () => {
		// Given
		const program = "1,9,10,3,2,3,11,0,99,30,40,50";
		const expected = 3500;

		const vm = new IntcodeVM();
		vm.loadProgram(program);

		// When
		const result = vm.runUntilComplete();

		expect(result[0]).toBe(expected);
	});
});
