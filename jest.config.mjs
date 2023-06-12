export default {
  cache: false,
  maxWorkers: 1,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/',
    '/.spec.[jt]s$/',
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

  testMatch: ['**/src/**/*.spec.[jt]s'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.m?[tj]sx?$': ['ts-jest', {
      useESM: true,
      tsconfig: '<rootDir>/tsconfig.build.json',
    }],
  },
};
