module.exports = {
    roots: [
        '<rootDir>/src',
        '<rootDir>/spec'
    ],
    globals: {
        'ts-jest': {
            'tsConfig': 'jest/tsconfig.json',
            diagnostics: false
        }
    },
    testRegex: '.+\\.spec\\.(ts|js)$',
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    moduleFileExtensions: [
        'ts',
        'js'
    ],
    transformIgnorePatterns: [
        'node_modules'
    ],
    moduleDirectories: [
        'node_modules',
        'src',
        'spec'
    ],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.js',
        'src/**/*.ts'
    ],
    coveragePathIgnorePatterns: [
        '/node_modules/'
    ]
};
