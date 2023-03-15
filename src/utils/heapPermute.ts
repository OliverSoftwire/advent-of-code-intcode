function isEven(n: number): boolean {
	return Boolean(~n & 1);
}

function swap<T>(arr: T[], indexA: number, indexB: number) {
	const tmp = arr[indexA];
	arr[indexA] = arr[indexB];
	arr[indexB] = tmp;
}

// https://en.wikipedia.org/wiki/Heap%27s_algorithm
export function permuteArray<T>(arr: T[]): T[][] {
	const output: T[][] = [];
	const stackState = arr.map(() => 0);

	output.push([...arr]);

	let i = 1;
	while (i < arr.length) {
		if (stackState[i] < i) {
			if (isEven(i)) {
				swap(arr, 0, i);
			} else {
				swap(arr, stackState[i], i);
			}

			output.push([...arr]);

			stackState[i]++;
			i = 1;
		} else {
			stackState[i] = 0;
			i++;
		}
	}

	return output;
}
