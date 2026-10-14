import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["node_modules/**", "dist/**"]),
  {
    languageOptions: {
      globals: globals.worker,
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
]);
