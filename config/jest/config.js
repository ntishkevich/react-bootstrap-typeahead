module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
  ],
  moduleFileExtensions: [
    'js',
    'jsx',
    'node',
  ],
  rootDir: './../../',
  setupFiles: [
    '<rootDir>/config/jest/polyfills.js',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/config/jest/setupFile.js',
  ],
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/test/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/test/**/*.{js,jsx}',
  ],
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.(scss|css)$': '<rootDir>/config/jest/cssTransform.js',
    // eslint-disable-next-line sort-keys,max-len
    '^(?!.*\\.(js|jsx|scss|css|json)$)': '<rootDir>/config/jest/fileTransform.js',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$',
  ],
};
