module.exports = {
  testMatch: ['<rootDir>/packages/*/src/**/__tests__/*.spec.(ts|js)?(x)'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.base.json',
    },
  },
  transform: {
    '.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: ['packages/*/src/**/*.{ts,tsx}', '!**/*.d.ts', '!**/__tests__/**'],
  coveragePathIgnorePatterns: ['types.ts'],
  transformIgnorePatterns: ['node_modules'],
  moduleNameMapper: {
    '@stoplight/prism-core': '<rootDir>/packages/core/src',
    '@stoplight/prism-core/(.*)': '<rootDir>/packages/core/src/$1',
    '@stoplight/prism-cli': '<rootDir>/packages/cli/src',
    '@stoplight/prism-cli/(.*)': '<rootDir>/packages/cli/src/$1',
    '@stoplight/prism-http': '<rootDir>/packages/http/src',
    '@stoplight/prism-http/(.*)': '<rootDir>/packages/http/src/$1',
    '@stoplight/prism-http-server': '<rootDir>/packages/http-server/src',
    '@stoplight/prism-http-server/(.*)': '<rootDir>/packages/http-server/src/$1',
  },
};
