import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    projects: ["service/*", "shared/*"],
  },
})
