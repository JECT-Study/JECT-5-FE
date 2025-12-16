import { promises as fs } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

type WalkOptions = {
  filterExts?: Set<string>
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function walk(dir: string, opts: WalkOptions = {}): Promise<string[]> {
  const out: string[] = []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    if (e.name.startsWith(".")) continue // skip hidden
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      out.push(...(await walk(full, opts)))
    } else if (e.isFile()) {
      if (opts.filterExts) {
        const ext = path.extname(e.name).toLowerCase()
        if (!opts.filterExts.has(ext)) continue
      }
      out.push(full)
    }
  }
  return out
}

function longestBacktickRun(s: string): number {
  let max = 0
  let cur = 0
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "`") {
      cur++
      if (cur > max) max = cur
    } else {
      cur = 0
    }
  }
  return max
}

function codeFenceFor(content: string): string {
  const longest = longestBacktickRun(content)
  const len = Math.max(3, longest + 1)
  return "`".repeat(len)
}

function languageForExt(ext: string): string {
  switch (ext) {
    case ".ts":
      return "ts"
    case ".tsx":
      return "tsx"
    case ".js":
      return "js"
    case ".jsx":
      return "jsx"
    case ".md":
      return "md"
    case ".mdx":
      return "mdx"
    case ".css":
      return "css"
    case ".json":
      return "json"
    default:
      return ""
  }
}

async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true })
}

async function fileExists(p: string) {
  try {
    await fs.stat(p)
    return true
  } catch {
    return false
  }
}

async function generateMDX(inputFile: string, inBase: string, outBase: string) {
  const rel = path.relative(inBase, inputFile)
  const srcExt = path.extname(inputFile)
  const baseName = path.basename(inputFile)
  const language = languageForExt(srcExt)
  const content = await fs.readFile(inputFile, "utf8")
  const fence = codeFenceFor(content)

  const frontmatter = [
    "---",
    `title: ${baseName}`,
    `source: ${path.join("src/stories", rel).replaceAll("\\", "/")}`,
    `generated: ${new Date().toISOString()}`,
    "---",
    "",
  ].join("\n")

  const heading = `# ${baseName}\n\n`
  const codeBlock = [
    `${fence}${language ? language : ""}`.trimEnd(),
    `// Source: ${path.join("src/stories", rel).replaceAll("\\", "/")}`,
    content,
    fence,
    "",
  ].join("\n")

  const mdx = frontmatter + heading + codeBlock

  const relOut = rel.replace(/\.[^.]+$/, ".mdx")
  const outFile = path.join(outBase, relOut)
  await ensureDir(path.dirname(outFile))
  await fs.writeFile(outFile, mdx, "utf8")
  return outFile
}

async function main() {
  const inBase = path.resolve(__dirname, "src/stories")
  const outBase = path.resolve(__dirname, "../figma-plugin/rules")

  if (!(await fileExists(inBase))) {
    console.error(`Input folder not found: ${inBase}`)
    process.exit(1)
  }
  await ensureDir(outBase)

  const filterExts = new Set([".ts", ".tsx", ".js", ".jsx", ".md", ".mdx"])
  const files = await walk(inBase, { filterExts })
  if (files.length === 0) {
    console.warn(
      "No files found under src/stories matching allowed extensions.",
    )
    return
  }

  console.log(`Found ${files.length} file(s). Generating MDX into: ${outBase}`)

  let count = 0
  for (const f of files) {
    try {
      const outFile = await generateMDX(f, inBase, outBase)
      count++
      console.log(`✓ ${path.relative(outBase, outFile).replaceAll("\\", "/")}`)
    } catch (err) {
      console.error(`✗ Failed to process ${f}:`, err)
    }
  }
  console.log(`Done. Wrote ${count} MDX file(s).`)
}

// Run if invoked directly

main()
