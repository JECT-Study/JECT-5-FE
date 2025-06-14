import { FlatCompat } from "@eslint/eslintrc"
import { defineConfig } from "eslint/config"
import baseConfig from "./base.js"

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

export default defineConfig([
  ...baseConfig,
  ...compat.config({
    extends: ["next", "next/core-web-vitals", "next/typescript"],
    rules: {
      "no-unused-vars": "off",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          ignoreRestSiblings: true,
          caughtErrors: "none",
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
    },
  }),
])
