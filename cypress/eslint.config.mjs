import globals from "globals";
import pluginJs from "@eslint/js";
import pluginCypress from "eslint-plugin-cypress/flat";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { globals: globals.browser },
    extends: ["plugin:cypress/recommended"],
    plugins: {
      cypress: pluginCypress,
    },
    rules: {
      "cypress/unsafe-to-chain-command": "error",
    },
  },
  pluginJs.configs.recommended,
];
