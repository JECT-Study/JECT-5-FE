import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { v4 as uuidv4 } from "uuid"
import WebSocket from "ws"
import { z } from "zod"

// Define TypeScript interfaces for Figma responses
interface FigmaResponse {
  id: string
  result?: any
  error?: string
}

// Custom logging functions that write to stderr instead of stdout to avoid being captured
const logger = {
  info: (message: string) => process.stderr.write(`[INFO] ${message}\n`),
  debug: (message: string) => process.stderr.write(`[DEBUG] ${message}\n`),
  warn: (message: string) => process.stderr.write(`[WARN] ${message}\n`),
  error: (message: string) => process.stderr.write(`[ERROR] ${message}\n`),
  log: (message: string) => process.stderr.write(`[LOG] ${message}\n`),
}

// WebSocket connection and request tracking
let ws: WebSocket | null = null
const pendingRequests = new Map<
  string,
  {
    resolve: (value: any) => void
    reject: (reason: any) => void
    timeout: ReturnType<typeof setTimeout>
  }
>()

// Create MCP server
const server = new McpServer({
  name: "@jongh/figma-plugin",
  version: "1.0.0",
})
// Add command line argument parsing
const args = process.argv.slice(2)
const serverArg = args.find((arg) => arg.startsWith("--server="))
const serverUrl = serverArg ? serverArg.split("=")[1] : "localhost"
const WS_URL =
  serverUrl === "localhost" ? `ws://${serverUrl}` : `wss://${serverUrl}`

// Document Info Tool
server.tool(
  "get_document_info",
  "Get detailed information about the current Figma document",
  {},
  async () => {
    try {
      const result = await sendCommandToFigma("get_document_info")
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting document info: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      }
    }
  },
)

// Selection Tool
server.tool(
  "get_selection",
  "Get information about the current selection in Figma",
  {},
  async () => {
    try {
      const result = await sendCommandToFigma("get_selection")
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
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
server.tool(
  "get_node_info",
  "Get detailed information about a specific node in Figma",
  {
    nodeId: z.string().describe("The ID of the node to get information about"),
  },
  async ({ nodeId }) => {
    try {
      const result = await sendCommandToFigma("get_node_info", { nodeId })
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting node info: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      }
    }
  },
)

server.prompt(
  "connection_troubleshooting",
  "Help users troubleshoot connection issues",
  () => {
    return {
      messages: [
        {
          role: "assistant",
          content: {
            type: "text",
            text: `When users report connection issues, ask them to check:

1. Figma Plugin Connection:
  - Did you click the "Connect" button in the Figma plugin?
  - Is the Figma plugin running and showing a connected status?
  - Try refreshing the plugin or restarting it if needed

2. MCP Connection in Cursor:
  - Go to Cursor Settings/Preferences
  - Check if the MCP server connection is properly configured(green light)
  - Verify the MCP server is running and connected
  - Look for any connection error messages in the settings

If both are properly connected and issues persist, try:
- Restarting both the Figma plugin and Cursor
- Checking if the WebSocket connection is blocked by firewall
- Verifying the correct server URL and port configuration`,
          },
        },
      ],
      description:
        "Troubleshooting guide for connection issues between Figma plugin and MCP server",
    }
  },
)

server.prompt(
  "data_analysis_strategy",
  "Best practices for analyzing Figma design data",
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

// Define command types and parameters
type FigmaCommand = "get_document_info" | "get_selection" | "get_node_info"

// Update the connectToFigma function
function connectToFigma(port = 3055) {
  // If already connected, do nothing
  if (ws && ws.readyState === WebSocket.OPEN) {
    logger.info("Already connected to Figma")
    return
  }

  const wsUrl = serverUrl === "localhost" ? `${WS_URL}:${port}` : WS_URL
  logger.info(`Connecting to Figma socket server at ${wsUrl}...`)
  ws = new WebSocket(wsUrl)

  ws.on("open", () => {
    logger.info("Connected to Figma socket server")
  })

  ws.on("message", (data: any) => {
    try {
      const json = JSON.parse(data) as { message: FigmaResponse }
      const myResponse = json.message
      logger.debug(`Received message: ${JSON.stringify(myResponse)}`)
      logger.log("myResponse" + JSON.stringify(myResponse))

      // Handle response to a request
      if (
        myResponse.id &&
        pendingRequests.has(myResponse.id) &&
        myResponse.result
      ) {
        const request = pendingRequests.get(myResponse.id)!
        clearTimeout(request.timeout)

        if (myResponse.error) {
          logger.error(`Error from Figma: ${myResponse.error}`)
          request.reject(new Error(myResponse.error))
        } else {
          if (myResponse.result) {
            request.resolve(myResponse.result)
          }
        }

        pendingRequests.delete(myResponse.id)
      } else {
        // Handle broadcast messages or events
        logger.info(`Received broadcast message: ${JSON.stringify(myResponse)}`)
      }
    } catch (error) {
      logger.error(
        `Error parsing message: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  })

  ws.on("error", (error) => {
    logger.error(`Socket error: ${error}`)
  })

  ws.on("close", () => {
    logger.info("Disconnected from Figma socket server")
    ws = null

    // Reject all pending requests
    for (const [id, request] of pendingRequests.entries()) {
      clearTimeout(request.timeout)
      request.reject(new Error("Connection closed"))
      pendingRequests.delete(id)
    }

    // Attempt to reconnect
    logger.info("Attempting to reconnect in 2 seconds...")
    setTimeout(() => connectToFigma(port), 2000)
  })
}

// Function to send commands to Figma
function sendCommandToFigma(
  command: FigmaCommand,
  params: unknown = {},
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    // If not connected, try to connect first
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      connectToFigma()
      reject(new Error("Not connected to Figma. Attempting to connect..."))
      return
    }

    const id = uuidv4()
    const request = {
      id,
      type: "message",
      message: {
        id,
        command,
        params: {
          ...(params as any),
        },
      },
    }

    // Set timeout for request
    const timeout = setTimeout(() => {
      if (pendingRequests.has(id)) {
        pendingRequests.delete(id)
        logger.error(`Request ${id} to Figma timed out after 30 seconds`)
        reject(new Error("Request to Figma timed out"))
      }
    }, 30000) // 30 second timeout

    // Store the promise callbacks to resolve/reject later
    pendingRequests.set(id, { resolve, reject, timeout })

    // Send the request
    logger.info(`Sending command to Figma: ${command}`)
    logger.debug(`Request details: ${JSON.stringify(request)}`)
    ws.send(JSON.stringify(request))
  })
}

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
