/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	coveragePathIgnorePatterns: [
		'.mock.ts',
		'main.ts',
		'server.ts',
		'mongo_wrapper.ts',
		'config_env.ts',
		'google_auth.ts'
	],
	coverageThreshold: {
		'global': {
			'lines': 100,
			'branches':94,
			'functions':100, 'statements':100}}
};