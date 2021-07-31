export default {
  cache: false,
  maxWorkers: 1,
  clearMocks: true,
  collectCoverage: true,
  coverageProvider: 'babel',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/grammar.ts',
    'src/compiler/parser.ts',
    'src/index.ts',
    'src/compiler/index.ts',
    'src/compiler/plugins/index.ts',
    'src/compiler/types/index.ts',
    'src/emulator/index.ts',
  ],
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
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: false,
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.build.json',
    },
  },
};
