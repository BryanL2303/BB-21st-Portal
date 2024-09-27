module.exports = {
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
      // Optional: Specify the initial HTML to be used
      html: '<!DOCTYPE html>',
    },
    setupFilesAfterEnv: ['./jest.setup.js'],
    transform: {
      "^.+\\.[jt]sx?$": "babel-jest",  // Transpile JavaScript and JSX using babel-jest
    },
    transformIgnorePatterns: [
      '/node_modules/', // Don't ignore node_modules by default
    ],
    moduleFileExtensions: ["js", "jsx", "ts", "tsx"],  // Add support for both JS and JSX files
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    testPathIgnorePatterns: ['/node_modules/', '/config/webpack/'], // Ignore Webpack config folder
  };