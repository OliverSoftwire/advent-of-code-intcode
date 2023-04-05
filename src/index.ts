import solutions from "./solutions";

solutions.map(async (solution) => {
	const result = await solution.run();

	console.log(`Day ${solution.day}`);
	console.log(result.part1);
	console.log(result.part2);
});
