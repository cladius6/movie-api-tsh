/* eslint-disable */
const { generateModuleNameMapper } = require('@bestcodetools/jest-tsconfig-paths-mapper');
export default {
  moduleFileExtensions: ['js', 'ts', 'json'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    // '**/?(*.)+(spec|test).js?(x)',
    '**/?(*.)+(spec|test).ts?(x)',
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleNameMapper: generateModuleNameMapper(),
};
