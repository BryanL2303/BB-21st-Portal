module.exports = {
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
      // Optional: Specify the initial HTML to be used
      html: '<!DOCTYPE html>',
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
    transform: {
      "^.+\\.jsx$": "babel-jest",
    },
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    testPathIgnorePatterns: ['/node_modules/', '/config/webpack/'], // Ignore Webpack config folder
  };