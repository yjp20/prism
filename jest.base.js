module.exports = {
  testMatch: ['<rootDir>/**/__tests__/*.spec.(ts|js)?(x)'],
  // globals: {
  //   'ts-jest': {
  //     tsConfig: 'tsconfig.json',
  //   },
  // },
  transform: {
    '.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transformIgnorePatterns: ['node_modules'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/*.d.ts', '!**/__tests__/**'],
  // collectCoverageFrom: ['packages/*/src/**/*.{ts,tsx}', '!**/*.d.ts', '!**/__tests__/**'],
  coveragePathIgnorePatterns: ['types.ts'],
};
