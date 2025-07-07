import { defineConfig } from "eslint/config"
import baseConfig from "./base.js"
import nextPlugin from "@next/eslint-plugin-next"

export default defineConfig([
  ...baseConfig,
  nextPlugin.flatConfig.recommended,
  nextPlugin.flatConfig.coreWebVitals,
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "dist/**"],
  },
])
