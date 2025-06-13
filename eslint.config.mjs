import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], languageOptions: { globals: globals.browser } },
   {
    files: ["**/*.{ts,mts,cts}"], // Apply these rules specifically to TypeScript files
    rules: {
      // Allow @ts-ignore without error.
      // You can also configure this rule more strictly if you prefer,
      // e.g., to require a description for @ts-expect-error
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-ignore": "allow-with-description", // Allows @ts-ignore, but recommends a description
          "ts-expect-error": "allow-with-description",
          "ts-nocheck": false, // Disallow @ts-nocheck
          "ts-check": false    // Disallow @ts-check
        }
      ],
      // Adjust no-trailing-spaces to ignore comments
      "no-trailing-spaces": ["error", { "skipBlankLines": true, "ignoreComments": true }],
      // You might also want to ensure the spaced-comment rule is configured as desired
      // "spaced-comment": ["error", "always"]
    },
    // Important: For type-aware rules, you need to specify parserOptions with project.
    // This is usually handled by `tseslint.configs.recommendedTypeChecked` if you were using it.
    // If you're only using `recommended`, you might need to add this manually if you have type-aware rules:
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.eslint.json'], // This will look for a tsconfig.json in the current directory or parent directories
        tsconfigRootDir: import.meta.dirname, // Use import.meta.dirname for current file's directory
      },
    },
  },
  tseslint.configs.recommended,
]);
