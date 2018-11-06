const moduleNameMapper = {
  '@stoplight/prism-core': '<rootDir>/packages/core/src',
  '@stoplight/prism-core/(.*)': '<rootDir>/packages/core/src/$1',
  '@stoplight/prism-cli': '<rootDir>/packages/cli/src',
  '@stoplight/prism-cli/(.*)': '<rootDir>/packages/cli/src/$1',
  '@stoplight/prism-http': '<rootDir>/packages/http/src',
  '@stoplight/prism-http/(.*)': '<rootDir>/packages/http/src/$1',
  '@stoplight/prism-http-server': '<rootDir>/packages/http-server/src',
  '@stoplight/prism-http-server/(.*)': '<rootDir>/packages/http-server/src/$1',
};

const transformIgnorePatterns = ['node_modules', 'lib'];
const moduleFileExtensions = ['js', 'json', 'jsx', 'node', 'jsx', 'ts', 'tsx'];
const transform = {
  '^.+\\.(ts|tsx)$': 'ts-jest',
};

module.exports = {
  projects: [
    {
      displayName: 'HTTP-SERVER',
      testMatch: ['<rootDir>/packages/http-server/**/__tests__/*.spec.(ts)?(x)'],
      transform,
      moduleFileExtensions,
      transformIgnorePatterns,
      moduleNameMapper,
      globals: {
        'ts-jest': {
          tsConfig: '<rootDir>/packages/http-server/tsconfig.json',
        },
      },
    },
    {
      displayName: 'HTTP',
      testMatch: ['<rootDir>/packages/http/**/__tests__/*.spec.(ts)?(x)'],
      transform,
      moduleFileExtensions,
      transformIgnorePatterns,
      moduleNameMapper,
      globals: {
        'ts-jest': {
          tsConfig: '<rootDir>/packages/http/tsconfig.json',
        },
      },
    },
    {
      displayName: 'CORE',
      testMatch: ['<rootDir>/packages/core/**/__tests__/*.spec.(ts)?(x)'],
      transform,
      moduleFileExtensions,
      transformIgnorePatterns,
      moduleNameMapper,
      globals: {
        'ts-jest': {
          tsConfig: '<rootDir>/packages/core/tsconfig.json',
        },
      },
    },
    {
      displayName: 'CLI',
      testMatch: ['<rootDir>/packages/cli/**/__tests__/*.spec.(ts)?(x)'],
      transform,
      moduleFileExtensions,
      transformIgnorePatterns,
      moduleNameMapper,
      globals: {
        'ts-jest': {
          tsConfig: '<rootDir>/packages/cli/tsconfig.json',
        },
      },
    },
  ],
  collectCoverageFrom: [
    '**/src/**/*.{ts,tsx}',
    '!example/**',
    '!**/lib/**',
    '!**/*.d.ts',
    '!**/__tests__/**',
    '!**/types.ts',
  ],
};
