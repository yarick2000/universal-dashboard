import {Config as JestConfig} from '@jest/types';
import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

const clientConfig: Config = {
  displayName: 'client',
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest', {
        tsconfig: '<rootDir>/tsconfig.test.json',
        useESM: true,
      },
    ],
  },
  clearMocks: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@root/(.*)$': '<rootDir>/$1',
  },
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  testMatch: [
    '<rootDir>/src/**/*.(test|spec).(ts|tsx|js|jsx)',
  ],
  testEnvironmentOptions: {
    resources: 'usable',
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/ui-tests/',
  ],
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.client.ts'],
};

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
  clearMocks: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@root/(.*)$': '<rootDir>/$1',
  },
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  testMatch: [
    '<rootDir>/src/**/*.(server_test|server_spec).(ts|tsx|js|jsx)',
  ],
  testEnvironmentOptions: {
    resources: 'usable',
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/ui-tests/',
  ],
};

// Add any custom config to be passed to Jest
const config = (configs: Config[]) => {
  return {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    projects: configs,
  } as JestConfig.InitialOptions;
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config([clientConfig, serverConfig]));
