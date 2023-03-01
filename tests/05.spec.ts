import { IntcodeVM } from "intcode";
import solution from "solutions/day5";

describe("Day 5", () => {
	it("should pass the example program", () => {
		// Given
		const program = "1002,4,3,4,33";
		const expected = 99;

		const vm = new IntcodeVM();
		vm.loadProgram(program);

		// When
		const result = vm.runUntilComplete();

		// Then
		expect(result[4]).toBe(expected);
	});

	it("should solve part 1", () => {
		// When
		const result = solution.run();

		// Then
		expect(result.part1).toBe(5044655);
	});

	xit("should solve part 2", () => {
		// When
		const result = solution.run();

		// Then
		expect(result.part2).toBe(undefined);
	});
});
