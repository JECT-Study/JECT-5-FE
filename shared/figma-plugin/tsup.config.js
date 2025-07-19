import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["cjs"],
  clean: true,
  outDir: "dist/server",
  target: "node18",
  bundle: true,
})
