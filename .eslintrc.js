module.exports = {
  settings: {
    react: {
      version: 'detect', // Automatically picks the version you have installed
    },
  },
  env: {
    browser: true, // If your code runs in a browser
    es6: true,     // Enable ES6 features
    jest: true,    // Enables Jest global variables like 'test' and 'expect'
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended', // React plugin
    'plugin:jest/recommended',   // Recommended rules for Jest
  ],
  // Other ESLint configuration...
};