import path from "node:path"
import { fileURLToPath } from "node:url"

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import { defineConfig, defineProject, mergeConfig } from "vitest/config"

import viteConfig from "./vite.config"

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineProject(
  mergeConfig(
    viteConfig,
    defineConfig({
      plugins: [
        storybookTest({
          configDir: path.join(dirname, ".storybook"),
        }),
      ],
      test: {
        name: "storybook",
        passWithNoTests: true,
        browser: {
          enabled: true,
          headless: true,
          provider: "playwright",
          instances: [{ browser: "chromium" }],
        },
        setupFiles: [".storybook/vitest.setup.ts"],
      },
    }),
  ),
)
