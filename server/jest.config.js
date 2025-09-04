/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  roots: ['<rootDir>'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  verbose: false,
  testTimeout: 30000,
};
