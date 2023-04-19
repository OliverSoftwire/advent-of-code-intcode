import _ from "lodash";
import solutions from "./solutions";

const results = await Promise.all(solutions.map((solution) => solution.run()));

_.sortBy(results, (r) => r.day).forEach((result) => {
	console.log(`Day ${result.day}`);
	console.log(result.part1);
	console.log(result.part2);
});
