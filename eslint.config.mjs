import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";


export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ignores: [
      "node_modules/",  // Ignore the node_modules directory
      "**/**/*.test.js",      // Ignore test files
    ],
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
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];