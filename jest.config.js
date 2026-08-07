module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/app/**/*.tsx'],
  coveragePathIgnorePatterns: ['_layout'],
  coverageDirectory: 'tests/coverage',
  coverageReporters: ['text', 'lcov'],
  preset: 'jest-expo',
  transformIgnorePatterns: [],
};
