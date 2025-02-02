import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"], // Apply to all .js files
    languageOptions: {
      sourceType: "module", // Switch to ES Modules
      globals: {
        ...globals.browser, // Include browser globals
        ...globals.node, // Include Node.js globals
      },
      ecmaVersion: 2021, // Set ECMAScript version
    },
  },
  pluginJs.configs.recommended, // Use recommended rules from @eslint/js
  eslintPluginPrettier, // Use Prettier plugin with recommended config
  {
    rules: {
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto", // Handle line endings automatically
        },
      ],
    },
  },
];
