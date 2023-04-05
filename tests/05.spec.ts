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
		function testProgram(
			name: string,
			program: string,
			inputs: number[],
			expectedOutputs: number[]
		) {
			it(name, () => {
				// Given
				const vm = new IntcodeVM();
				vm.loadProgram(program);

				// When
				inputs.forEach((input) => {
					vm.writeInput(input);
					vm.runUntilComplete();
					vm.reset();
				});

				// Then
				expectedOutputs.forEach((expected) =>
					expect(vm.readOutput()).toBe(expected)
				);
				expect(vm.readOutput()).toBeUndefined();
			});
		}

		describe("comparisons to 8", () => {
			testProgram(
				"should pass the position mode equals example",
				"3,9,8,9,10,9,4,9,99,-1,8",
				[1, 8],
				[0, 1]
			);

			testProgram(
				"should pass the position mode less than example",
				"3,9,7,9,10,9,4,9,99,-1,8",
				[1, 8],
				[1, 0]
			);

			testProgram(
				"should pass the immediate mode equals example",
				"3,3,1108,-1,8,3,4,3,99",
				[1, 8],
				[0, 1]
			);

			testProgram(
				"should pass the immediate mode less than example",
				"3,3,1107,-1,8,3,4,3,99",
				[1, 8],
				[1, 0]
			);
		});

		describe("jump", () => {
			testProgram(
				"should pass the position mode jump example",
				"3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9",
				[0, 1],
				[0, 1]
			);

			testProgram(
				"should pass the immediate mode jump example",
				"3,3,1105,-1,9,1101,0,0,12,4,12,99,1",
				[0, 1],
				[0, 1]
			);
		});

		testProgram(
			"should pass complex example",
			"3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99",
			[1, 8, 10],
			[999, 1000, 1001]
		);
	});

	it("should solve part 1", async () => {
		// When
		const result = solution.runPart1();

		// Then
		await expect(result).resolves.toBe(5044655);
	});

	it("should solve part 2", async () => {
		// When
		const result = solution.runPart2();

		// Then
		await expect(result).resolves.toBe(7408802);
	});
});
