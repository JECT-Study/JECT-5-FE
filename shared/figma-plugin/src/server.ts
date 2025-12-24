import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import fs from "fs"
import path from "path"
import { z } from "zod"

import { createFigmaClient } from "./figmaClient"

// Custom logging functions that write to stderr instead of stdout to avoid being captured
const logger = {
  info: (message: string) => process.stderr.write(`[INFO] ${message}\n`),
  debug: (message: string) => process.stderr.write(`[DEBUG] ${message}\n`),
  warn: (message: string) => process.stderr.write(`[WARN] ${message}\n`),
  error: (message: string) => process.stderr.write(`[ERROR] ${message}\n`),
  log: (message: string) => process.stderr.write(`[LOG] ${message}\n`),
}

const BASE_DIR = path.join(__dirname, "../../", "rules")

function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length

  if (m === 0) return n
  if (n === 0) return m

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0),
  )

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // 삭제
        dp[i][j - 1] + 1, // 삽입
        dp[i - 1][j - 1] + cost, // 교체
      )
    }
  }

  return dp[m][n]
}

function getSimilarityScore(target: string, candidate: string): number {
  if (target === candidate) return 100

  // prefix / suffix / includes 가 우선
  if (candidate.startsWith(target) || target.startsWith(candidate)) return 95
  if (candidate.includes(target) || target.includes(candidate)) return 85

  const distance = levenshtein(target, candidate)
  const maxLen = Math.max(target.length, candidate.length)

  // 거리 기반 스코어 (대충 0~80 사이)
  const normalized = 1 - distance / maxLen // 0 ~ 1
  const score = Math.floor(normalized * 80)

  return score > 0 ? score : 0
}

const STORIES_EXT = ".stories.mdx" as const

/**
 * BASE_DIR 안에서 componentName 과 유사한 .stories.mdx 파일들을
 * 유사도 높은 순으로 반환
 */
function findSimilarStoriesFiles(baseDir: string, componentName: string) {
  const compName = componentName.toLowerCase()

  const files = fs
    .readdirSync(baseDir)
    .filter((file) => file.toLowerCase().endsWith(STORIES_EXT))

  const scored = files
    .map((file) => {
      const baseName = file
        .toLowerCase()
        .replace(new RegExp(`${STORIES_EXT.replace(".", "\\.")}$`), "")

      return {
        file,
        baseName,
        score: getSimilarityScore(compName, baseName),
      }
    })
    .filter(({ score }) => score > 0) // 완전 노이즈는 버림
    .sort((a, b) => b.score - a.score)

  return scored
}

// Create MCP server
const server = new McpServer(
  {
    name: "@jongh/figma-plugin",
    version: "1.0.0",
  },
  {
    capabilities: {
      logging: logger,
      resources: {
        subscribe: true,
        listChanged: true,
      },
    },
  },
)
// Add command line argument parsing
const args = process.argv.slice(2)
const serverArg = args.find((arg) => arg.startsWith("--server="))
const serverUrl = serverArg ? serverArg.split("=")[1] : "localhost"
const WS_URL =
  serverUrl === "localhost" ? `ws://${serverUrl}` : `wss://${serverUrl}`

const { connectToFigma, sendCommandToFigma } = createFigmaClient({
  logger,
  serverUrl,
  wsUrlBase: WS_URL,
})

// Document Info Tool
// server.registerTool(
//   "get_document_info",
//   {
//     description: "Get detailed information about the current Figma document",
//     inputSchema: {},
//   },
//   async () => {
//     try {
//       const result = await sendCommandToFigma("get_document_info")
//       return {
//         content: [
//           {
//             type: "text",
//             text: JSON.stringify(result),
//           },
//         ],
//       }
//     } catch (error) {
//       return {
//         content: [
//           {
//             type: "text",
//             text: `Error getting document info: ${error instanceof Error ? error.message : String(error)}`,
//           },
//         ],
//       }
//     }
//   },
// )

server.registerTool(
  "get_selection",
  {
    description: "Get information about the current selection in Figma",
    inputSchema: {},
  },
  async () => {
    try {
      const result = await sendCommandToFigma("get_selection")
      return {
        content: [
          {
            type: "text",
            text: "test",
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting selection: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      }
    }
  },
)

// Node Info Tool
// server.registerTool(
//   "get_node_info",
//   {
//     description: "Get detailed information about a specific node in Figma",
//     inputSchema: {
//       nodeId: z
//         .string()
//         .describe("The ID of the node to get information about"),
//     },
//   },
//   async ({ nodeId }) => {
//     try {
//       const result = await sendCommandToFigma("get_node_info", { nodeId })
//       return {
//         content: [
//           {
//             type: "text",
//             text: JSON.stringify(result),
//           },
//         ],
//       }
//     } catch (error) {
//       return {
//         content: [
//           {
//             type: "text",
//             text: `Error getting node info: ${error instanceof Error ? error.message : String(error)}`,
//           },
//         ],
//       }
//     }
//   },
// )

server.registerPrompt(
  "design system components",
  {
    description: "help analyze design system common components",
  },
  () => {
    return {
      messages: [
        {
          role: "assistant" as const,
          content: {
            type: "text",
            text: `공통 컴포넌트의 구현 정보를 파악하여 코드 제작에 활용해야 합니다. 코드 사용 예시, 설명 등을 정확하게 파악하여 실제 코드 제작에 정확하게 활용할 수 있어야 합니다.  
            특히 Figma 인터페이스와 코드 간의 구현 차이를 정확하게 파악하고 코드에 맞게 활용해야 합니다.`,
          },
        },
      ],
      description:
        "Troubleshooting guide for connection issues between Figma plugin and MCP server",
    }
  },
)

server.registerTool(
  "get_rule_of_components",
  {
    title: "Rule of design system component",
    description: [
      "디자인 시스템에서 사용하는 공통 컴포넌트의 구현 규칙(구조, props, 스타일 등)을 조회하는 MCP 도구입니다.",
      "Figma 디자인에서 사용된 공통 컴포넌트의 이름을 componentName 인자로 넘겨 호출하면,",
      "해당 컴포넌트의 구현 정보를 반환하여 ‘MCP를 통해 사용된 공통 컴포넌트의 구현 정보를 파악한 뒤’ 페이지 코드를 작성할 때 사용할 수 있습니다.",
      "예: Figma에서 Button 컴포넌트가 쓰였다면 componentName에 'button'을 넣어 이 도구를 호출해 구현 규칙을 조회하세요.",
    ].join(" "),
    inputSchema: z.object({
      componentName: z
        .string()
        .describe(
          "Figma/디자인 시스템에서 사용된 공통 컴포넌트 이름 (예: 'button', 'input', 'modal')",
        ),
    }),
  },
  async ({ componentName }) => {
    const similarFiles = findSimilarStoriesFiles(BASE_DIR, componentName)

    const compName = componentName.toLocaleLowerCase()
    const texts = similarFiles.map(({ file }) =>
      fs.readFileSync(path.join(BASE_DIR, file), "utf-8"),
    )
    return {
      content: [
        {
          type: "text",
          text: `${texts.join("")}`,
        },
      ],
    }
  },
)

server.registerResource(
  "file", // 리소스 ID
  new ResourceTemplate("file://{path}/", {
    list: async () => {
      const paths = fs.readdirSync(BASE_DIR)
      return {
        resources: paths.map((path) => ({
          uri: `file://${path}`,
          name: path,
          title: path,
          description: "local file from design-rules",
          mimeType: "text/plain", // 필요시 확장자 보고 바꾸셔도 됩니다
          _meta: {
            filePath: path,
          },
        })),
      }
    },
  }),
  {
    title: "design rule",
    description: "important rules and guidelines for resolving design data",
  },
  // resources/read 핸들러
  async (uri, props) => {
    const text = fs.readFileSync(
      path.join(BASE_DIR, props.path as string),
      "utf-8",
    )
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "text/plain",
          text: text,
        },
      ],
    }
  },
)
server.registerPrompt(
  "data_analysis_strategy",
  {
    description: "Best practices for analyzing Figma design data",
  },
  () => {
    return {
      messages: [
        {
          role: "assistant",
          content: {
            type: "text",
            text: `When analyzing Figma design data, follow these strategies 
            
            1. Data Extraction Workflow:
             - Use get_selection() to focus on specific areas of interest
             - Use get_document_info() when connection is enabled

            2. Component Analysis:
            - Identify reusable components vs one-off elements
            - Look for design system patterns (colors, typography, spacing)
            - Note component variants and their properties
            - Extract design tokens (colors, fonts, spacing values)

            3. Layout Analysis:
            - Analyze auto-layout settings and constraints
            - Document spacing patterns and grid systems
            - Identify responsive design patterns
            - Note alignment and positioning strategies

            


            `,
          },
        },
      ],
      description: "Best practices for working with Figma designs",
    }
  },
)

// Start the server
async function main() {
  try {
    // Try to connect to Figma socket server
    connectToFigma()
  } catch (error) {
    logger.warn(
      `Could not connect to Figma initially: ${error instanceof Error ? error.message : String(error)}`,
    )
    logger.warn("Will try to connect when the first command is sent")
  }

  // Start the MCP server with stdio transport
  const transport = new StdioServerTransport()
  await server.connect(transport)
  logger.info("FigmaMCP server running on stdio")
}

// Run the server
main().catch((error) => {
  logger.error(
    `Error starting FigmaMCP server: ${error instanceof Error ? error.message : String(error)}`,
  )
  process.exit(1)
})
