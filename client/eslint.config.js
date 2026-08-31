const js = require("@eslint/js");
const globals = require("globals");
const jsxA11y = require("eslint-plugin-jsx-a11y");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");

module.exports = [
  {
    ignores: ["build/**", "coverage/**", "node_modules/**"],
  },
  js.configs.recommended,
  {
    files: ["eslint.config.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "react/prop-types": "off"
    },
  },
  {
    files: ["src/**/*.test.{js,jsx}", "src/test/**"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.vitest,
      },
    },
  },
];
