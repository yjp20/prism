module.exports = {
  projects: ['<rootDir>/packages/*'],
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
  collectCoverageFrom: ['**/src/**/*.{ts,tsx}', '!**/*.d.ts', '!**/__tests__/**'],
};
