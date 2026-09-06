import js from "@eslint/js";

export default [
  {
    ignores: ["**/node_modules/**", "dist/**", "**/*.ts", "**/*.tsx"],
  },
  {
    ...js.configs.recommended,
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        setTimeout: "readonly",
        URL: "readonly",
        fetch: "readonly",
        Buffer: "readonly",
      },
    },
  },
];
