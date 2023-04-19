import solution from "../src/solutions/day17";

it("should solve part 1", async () => {
	// When
	const result = solution.runPart1();

	// Then
	await expect(result).resolves.toBe(3192);
});
