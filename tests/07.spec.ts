import { IntcodeVM } from "intcode";
import { runPhaseSequence } from "../src/solutions/day7";

describe("Day 7", () => {
	it("should pass the example program", () => {
		// Given
		const program = "1,9,10,3,2,3,11,0,99,30,40,50";
		const expected = 3500;

		const vm = new IntcodeVM();
		vm.loadProgram(program);

		// When
		const result = vm.runUntilComplete();

		// Then
		expect(result[0]).toBe(expected);
	});

	describe("examples", () => {
		it("should pass example 1", () => {
			// Given
			const program = "3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0";
			const phaseSequence = [4, 3, 2, 1, 0];

			// When
			const power = runPhaseSequence(program, phaseSequence);

			// Then
			expect(power).toBe(43210);
		});

		it("should pass example 2", () => {
			// Given
			const program =
				"3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0";
			const phaseSequence = [0, 1, 2, 3, 4];

			// When
			const power = runPhaseSequence(program, phaseSequence);

			// Then
			expect(power).toBe(54321);
		});

		it("should pass example 3", () => {
			// Given
			const program =
				"3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0";
			const phaseSequence = [1, 0, 4, 3, 2];

			// When
			const power = runPhaseSequence(program, phaseSequence);

			// Then
			expect(power).toBe(65210);
		});
	});

	xit("should solve part 1", () => {});

	xit("should solve part 2", () => {});
});
