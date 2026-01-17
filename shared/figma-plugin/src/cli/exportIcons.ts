import fs from "fs"
import path from "path"
import WebSocket from "ws"

type ExportedIcon = {
  nodeId: string
  figmaName: string
  figmaType: string
  svg: string
}

function arg(name: string): string | undefined {
  const idx = process.argv.indexOf(name)
  return idx >= 0 ? process.argv[idx + 1] : undefined
}

function randomId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

async function callSocketServer<T>(
  port: number,
  command: string,
  params: unknown,
) {
  const id = randomId()
  const ws = new WebSocket(`ws://localhost:${port}`)

  return await new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => {
      ws.close()
      reject(new Error("Timeout waiting for socket response"))
    }, 30_000)

    ws.on("open", () => {
      ws.send(
        JSON.stringify({
          type: "message",
          message: { id, command, params },
        }),
      )
    })

    ws.on("message", (raw) => {
      try {
        const data = JSON.parse(raw.toString())
        if (data?.type !== "broadcast") return
        const msg = data?.message
        if (!msg || msg.id !== id) return

        if (!("result" in msg) && !("error" in msg)) return

        clearTimeout(timeout)
        ws.close()

        if (msg.error) reject(new Error(msg.error))
        else resolve(msg.result as T)
      } catch {
        // ignore unrelated messages
      }
    })

    ws.on("error", (e) => {
      clearTimeout(timeout)
      reject(e)
    })
  })
}

async function main() {
  const port = Number(arg("--port") ?? process.env.FIGMA_SOCKET_PORT ?? 3055)
  const out = arg("--out") ?? ".tmp/icons.export.json"

  const result = await callSocketServer<{ icons: ExportedIcon[] }>(
    port,
    "export_icons_from_frame",
    { pageName: "컴포넌트", frameName: "아이콘", ignoreFrameChildren: true },
  )

  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, JSON.stringify(result.icons, null, 2) + "\n", "utf-8")
  process.stdout.write(
    `[figma-plugin] exported ${result.icons.length} icons -> ${out}\n`,
  )
}

main().catch((e) => {
  process.stderr.write(
    `[figma-plugin] export-icons failed: ${e instanceof Error ? e.message : String(e)}\n`,
  )
  process.exit(1)
})
