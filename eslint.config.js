// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked, // Using type-checked for better linting
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        project: true, // Automatically finds tsconfig.json relative to this config file
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Rules from original .eslintrc.json
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-empty-function": [
        "error",
        { allow: ["arrowFunctions"] },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // It's possible that recommendedTypeChecked is stricter and might introduce new warnings/errors.
      // We can adjust these as needed after the first lint run.
      // For example, if 'no-floating-promises' becomes an issue with main() in cli.ts:
      // "@typescript-eslint/no-floating-promises": ["error", { "ignoreVoid": true, "ignoreIIFEs": true }]
    },
  },
  {
    // Configuration for files to ignore
    // Note: ESLint v9 automatically ignores node_modules/** and .git/**
    // Explicitly ignoring dist/** and the old .eslintrc.json
    ignores: ["dist/**", ".eslintrc.json"],
  }
);
