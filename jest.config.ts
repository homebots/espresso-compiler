export default {
  cache: false,
  clearMocks: true,
  collectCoverage: true,
  // coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  maxWorkers: '90%',
  moduleFileExtensions: ['js', 'ts'],
  slowTestThreshold: 1,
  // testEnvironment: 'jest-environment-node',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: true,
};
