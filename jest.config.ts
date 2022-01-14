export default {
  // cache: false,
  maxWorkers: 4,
  clearMocks: true,
  collectCoverage: true,
  coverageProvider: 'babel',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'tests/grammar.ts',
    'tests/compiler/parser.ts',
    'tests/index.ts',
    'tests/compiler/index.ts',
    'tests/compiler/plugins/index.ts',
    'tests/compiler/types/index.ts',
    'tests/emulator/index.ts',
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
  slowTestThreshold: 2,
  testEnvironment: 'node',
  verbose: false,

  // preset: 'ts-jest/presets/default-esm',
  transform: {
    // '^.+\\.js$': 'babel-jest',
    '^.+\\.ts$': 'ts-jest',
  },
  // transformIgnorePatterns: ['node_modules/(?!((jest-)?react-native|@react-native(-community)?)/)'],
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      // useESM: true,
      // tsConfig: '<rootDir>/tsconfig.test.json',
    },
  },
};
