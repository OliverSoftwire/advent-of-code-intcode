import solution from "../src/solutions/day11";

describe("Day 9", () => {
	it("should solve part 1", async () => {
		// When
		const result = solution.runPart1();

		// Then
		await expect(result).resolves.toBe(1876);
	});

	it("should solve part 2", async () => {
		// When
		const result = solution.runPart2();

		// Then
		await expect(result).resolves.toMatchInlineSnapshot(`
		"  ██   ██  ███    ██  ██   ██   ██  █      
		 █  █ █  █ █  █    █ █  █ █  █ █  █ █      
		 █    █    █  █    █ █    █    █    █      
		 █    █ ██ ███     █ █    █ ██ █    █      
		 █  █ █  █ █    █  █ █  █ █  █ █  █ █      
		  ██   ███ █     ██   ██   ███  ██  ████   
		"
	`);
	});
});
