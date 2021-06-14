export default {
  cache: false,
  clearMocks: true,
  collectCoverage: true,
<<<<<<< HEAD
  coverageProvider: 'v8',
=======
  // coverageProvider: 'v8',
  coveragePathIgnorePatterns: ['/node_modules/', 'src/grammar.ts'],
>>>>>>> 9810dbb (refactor: compile parser code during build)
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
<<<<<<< HEAD
  maxWorkers: 1,
=======
>>>>>>> 9810dbb (refactor: compile parser code during build)
  moduleFileExtensions: ['js', 'ts'],
  slowTestThreshold: 1,
  testEnvironment: 'node',
  testMatch: ['**/src/**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: true,
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.build.json',
    },
  },
};
