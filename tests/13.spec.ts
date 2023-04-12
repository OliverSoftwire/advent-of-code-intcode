import solution from "../src/solutions/day13";

it("should solve part 1", async () => {
	// When
	const result = solution.runPart1();

	// Then
	await expect(result).resolves.toBe(301);
});

it("should solve part 2", async () => {
	// When
	const result = solution.runPart2();

	// Then
	await expect(result).resolves.toBe(14096);
});
