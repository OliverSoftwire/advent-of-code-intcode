/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
	preset: "ts-jest/presets/default-esm",
	testEnvironment: "node",
	testMatch: ["<rootDir>/tests/**/*.spec.ts"],
	moduleDirectories: ["node_modules", "src"],
	transform: {
		"^.+\\.tsx?$": [
			"ts-jest",
			{
				tsconfig: "./tsconfig.json",
				useESM: true,
			},
		],
	},
};

export default config;
