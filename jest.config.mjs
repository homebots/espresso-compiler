export default {
  cache: false,
  maxWorkers: 1,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/',
    '/.spec.[jt]s$/',
    'src/grammar.mts',
    'src/compiler/parser.mts',
    'src/index.mts',
    'src/compiler/index.mts',
    'src/compiler/plugins/index.mts',
    'src/compiler/types/index.mts',
    'src/emulator/index.mts',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },

  testMatch: ['**/src/**/*.spec.{js,ts,mjs,mts}'],
  extensionsToTreatAsEsm: ['.ts', '.mts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^(\\.{1,2}/.*)\\.mjs$': '$1',
  },
  transform: {
    '^.+\\.m?[tj]s$': ['ts-jest', {
      useESM: true,
      tsconfig: '<rootDir>/tsconfig.build.json',
    }],
    '^.+\\.spec.mts$': ['ts-jest', {
      useESM: true,
      tsconfig: '<rootDir>/tsconfig.build.json',
    }],
  },
};
