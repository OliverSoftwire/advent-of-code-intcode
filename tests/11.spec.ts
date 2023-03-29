import solution from "../src/solutions/day11";

describe("Day 9", () => {
	it("should solve part 1", () => {
		// When
		const result = solution.runPart1();

		// Then
		expect(result).toBe(1876);
	});

	it("should solve part 2", () => {
		// When
		const result = solution.runPart2();

		// Then
		expect(result).toMatchInlineSnapshot(`
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
