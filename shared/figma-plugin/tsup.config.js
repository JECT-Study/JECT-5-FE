import fs from "fs"
import path from "path"
import { defineConfig } from "tsup"

// 빌드 시점에 rules 파일들을 읽어서 객체로 만듦
function loadRules() {
  const rulesDir = path.join(process.cwd(), "rules")
  const files = fs.readdirSync(rulesDir)
  const rules = {}

  for (const file of files) {
    const content = fs.readFileSync(path.join(rulesDir, file), "utf-8")
    rules[file] = content
  }

  return rules
}

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["cjs"],
  clean: true,
  outDir: "dist/server",
  target: "node18",
  bundle: true,
  define: {
    __RULES__: JSON.stringify(loadRules()),
  },
})
