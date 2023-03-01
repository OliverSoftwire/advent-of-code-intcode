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

	describe("part 2 examples", () => {
		it("should pass the position mode equals example", () => {
			// Given
			const program = "3,9,8,9,10,9,4,9,99,-1,8";

			const vm = new IntcodeVM();
			vm.loadProgram(program);

			// When
			vm.writeInput(1);
			vm.runUntilComplete();

			vm.reset();

			vm.writeInput(8);
			vm.runUntilComplete();

			// Then
			expect(vm.readOutput()).toBe(0);
			expect(vm.readOutput()).toBe(1);
		});

		it("should pass the position mode less than example", () => {
			// Given
			const program = "3,9,7,9,10,9,4,9,99,-1,8";

			const vm = new IntcodeVM();
			vm.loadProgram(program);

			// When
			vm.writeInput(1);
			vm.runUntilComplete();

			vm.reset();

			vm.writeInput(8);
			vm.runUntilComplete();

			// Then
			expect(vm.readOutput()).toBe(1);
			expect(vm.readOutput()).toBe(0);
		});

		it("should pass the immediate mode equals example", () => {
			// Given
			const program = "3,3,1108,-1,8,3,4,3,99";

			const vm = new IntcodeVM();
			vm.loadProgram(program);

			// When
			vm.writeInput(1);
			vm.runUntilComplete();

			vm.reset();

			vm.writeInput(8);
			vm.runUntilComplete();

			// Then
			expect(vm.readOutput()).toBe(0);
			expect(vm.readOutput()).toBe(1);
		});

		it("should pass the immediate mode less than example", () => {
			// Given
			const program = "3,3,1107,-1,8,3,4,3,99";

			const vm = new IntcodeVM();
			vm.loadProgram(program);

			// When
			vm.writeInput(1);
			vm.runUntilComplete();

			vm.reset();

			vm.writeInput(8);
			vm.runUntilComplete();

			// Then
			expect(vm.readOutput()).toBe(1);
			expect(vm.readOutput()).toBe(0);
		});
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
