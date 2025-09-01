// jest.config.ts

import nextJest from 'next/jest.js';

import type { Config } from 'jest';


const createJestConfig = nextJest({
  dir: './',
});

// Base client config - note that transformIgnorePatterns is removed from here.
const clientConfig: Config = {
  displayName: 'client',
  testEnvironment: 'jsdom',
  clearMocks: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  testMatch: [
    '<rootDir>/src/**/*.(test|spec).(ts|tsx|js|jsx)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.client.ts'],
};

// Server config remains unchanged
const serverConfig: Config = {
  displayName: 'server',
  testEnvironment: 'node',
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest', {
        tsconfig: '<rootDir>/tsconfig.test.json',
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!typed-inject)',
  ],
  clearMocks: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  testMatch: [
    '<rootDir>/src/**/*.(server_test|server_spec).(ts|tsx|js|jsx)',
  ],
};

const createConfig = async () => {
  // Create the base config from next/jest
  const resolvedClientConfig = await createJestConfig(clientConfig)();

  // ✅ **KEY CHANGE**: Manually override transformIgnorePatterns
  // on the object that next/jest returns.
  resolvedClientConfig.transformIgnorePatterns = [
    // This pattern tells Jest to transform typed-inject, but ignore everything else in node_modules.
    '/node_modules/(?!typed-inject)/',
    // We also preserve the default pattern for CSS modules.
    '^.+\\.module\\.(css|sass|scss)$',
  ];

  return {
    coverageProvider: 'v8',
    projects: [
      resolvedClientConfig,
      serverConfig,
    ],
  };
};

export default createConfig;
