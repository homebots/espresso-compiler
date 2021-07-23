export default {
  cache: false,
  maxWorkers: 1,
  clearMocks: true,
  collectCoverage: true,
  coverageProvider: 'v8',
  coveragePathIgnorePatterns: ['/node_modules/', 'src/grammar.ts', 'src/compiler/parser.ts'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleFileExtensions: ['js', 'ts'],
  slowTestThreshold: 1,
  testEnvironment: 'node',
  // testMatch: ['**src/*.spec.ts'],
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
