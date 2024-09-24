import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";


export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: { globals: globals.browser },
    settings: {
      react: {
        version: 'detect', // Automatically picks the version you have installed
      },
    },
    env: {
      node: true,
      browser: true
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];