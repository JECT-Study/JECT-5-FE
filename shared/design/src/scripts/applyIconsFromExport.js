import fs from "fs"
import path from "path"

function normalizeIconKey(figmaName) {
  const placeholderMatch = /^iconPlaceholder\/(\d+px)$/i.exec(figmaName.trim())
  if (placeholderMatch) return `iconplaceholder_${placeholderMatch[1]}`

  const cleaned = figmaName
    .trim()
    .replace(/[()]/g, "")
    .replace(/[/\s\-_—]+/g, " ")
    .trim()

  const parts = cleaned.split(" ").filter(Boolean)
  if (parts.length === 0)
    throw new Error(`Cannot normalize empty name: "${figmaName}"`)

  const [first, ...rest] = parts
  return (
    first.charAt(0).toLowerCase() +
    first.slice(1) +
    rest.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("")
  )
}

function buildIconJsonEntries(items) {
  const bucket = new Map()
  for (const it of items) {
    const key = normalizeIconKey(it.figmaName)
    bucket.set(key, [...(bucket.get(key) ?? []), it.figmaName])
  }

  const collisions = []
  for (const [key, names] of bucket.entries()) {
    if (names.length > 1) collisions.push({ key, names })
  }

  if (collisions.length > 0) {
    throw new Error(
      `Icon key collisions — 충돌 시 실패:\n` +
        collisions.map((c) => `- ${c.key}: ${c.names.join(", ")}`).join("\n"),
    )
  }

  const out = {}
  for (const it of items) {
    const key = normalizeIconKey(it.figmaName)
    out[key] = { svg: it.svg, metadatas: [], name: it.figmaName }
  }
  return out
}

function arg(name) {
  const idx = process.argv.indexOf(name)
  return idx >= 0 ? process.argv[idx + 1] : undefined
}

async function main() {
  const inputPath = arg("--in") ?? ".tmp/icons.export.json"
  const outPath = arg("--out") ?? "src/icons/icon.json"

  const raw = fs.readFileSync(inputPath, "utf-8")
  const exported = JSON.parse(raw)

  const items = (exported ?? [])
    .filter((x) => x && x.svg && x.figmaName)
    .filter((x) => x.figmaType !== "FRAME")
    .map((x) => ({ figmaName: x.figmaName, svg: x.svg }))

  const iconJson = buildIconJsonEntries(items)

  const absOut = path.resolve(process.cwd(), outPath)
  fs.mkdirSync(path.dirname(absOut), { recursive: true })
  fs.writeFileSync(absOut, JSON.stringify(iconJson, null, 2) + "\n", "utf-8")

  process.stdout.write(
    `[design] wrote ${Object.keys(iconJson).length} icons -> ${absOut}\n`,
  )
}

main().catch((e) => {
  process.stderr.write(
    `[design] apply-icons failed: ${e instanceof Error ? e.message : String(e)}\n`,
  )
  process.exit(1)
})
