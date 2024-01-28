import type { JestConfigWithTsJest } from 'ts-jest';
/* eslint-disable */
const { generateModuleNameMapper } = require('@bestcodetools/jest-tsconfig-paths-mapper');
export default {
  moduleFileExtensions: ['js', 'ts', 'json'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/?(*.)+(spec|test).ts?(x)',
  ],
  transform: {
    '^.+\\.ts?$': [
      'ts-jest', { tsconfig: 'tsconfig.test.json'},
    ],
  },
  moduleNameMapper: generateModuleNameMapper(),
} as JestConfigWithTsJest;
