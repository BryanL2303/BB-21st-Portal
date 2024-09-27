import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";


export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: { 
      globals: { 
        ...globals.browser, // Browser globals
        ...globals.node    // Node.js globals
      },
      ecmaVersion: "latest", // Set ECMAScript version
      sourceType: "module",  // Use ES Modules
    },
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
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];