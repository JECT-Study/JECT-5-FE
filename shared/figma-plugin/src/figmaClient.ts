import { v4 as uuidv4 } from "uuid"
import WebSocket from "ws"

interface FigmaResponse {
  id: string
  result?: any
  error?: string
}

export type FigmaCommand =
  | "get_document_info"
  | "get_selection"
  | "get_node_info"

type PendingRequest = {
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
  timeout: ReturnType<typeof setTimeout>
}

type Logger = {
  info: (message: string) => void
  debug: (message: string) => void
  warn: (message: string) => void
  error: (message: string) => void
  log: (message: string) => void
}

type CreateFigmaClientParams = {
  logger: Logger
  serverUrl: string
  wsUrlBase: string
}

export function createFigmaClient({
  logger,
  serverUrl,
  wsUrlBase,
}: CreateFigmaClientParams) {
  let ws: WebSocket | null = null
  const pendingRequests = new Map<string, PendingRequest>()

  function connectToFigma(port = 3055) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      logger.info("Already connected to Figma")
      return
    }

    const wsUrl = serverUrl === "localhost" ? `${wsUrlBase}:${port}` : wsUrlBase
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
          } else if (myResponse.result) {
            request.resolve(myResponse.result)
          }

          pendingRequests.delete(myResponse.id)
        } else {
          logger.info(
            `Received broadcast message: ${JSON.stringify(myResponse)}`,
          )
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

      for (const [id, request] of pendingRequests.entries()) {
        clearTimeout(request.timeout)
        request.reject(new Error("Connection closed"))
        pendingRequests.delete(id)
      }

      logger.info("Attempting to reconnect in 2 seconds...")
      setTimeout(() => connectToFigma(port), 2000)
    })
  }

  function sendCommandToFigma(
    command: FigmaCommand,
    params: unknown = {},
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
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

      const timeout = setTimeout(() => {
        if (pendingRequests.has(id)) {
          pendingRequests.delete(id)
          logger.error(`Request ${id} to Figma timed out after 30 seconds`)
          reject(new Error("Request to Figma timed out"))
        }
      }, 30000)

      pendingRequests.set(id, { resolve, reject, timeout })

      logger.info(`Sending command to Figma: ${command}`)
      logger.debug(`Request details: ${JSON.stringify(request)}`)
      ws.send(JSON.stringify(request))
    })
  }

  return {
    connectToFigma,
    sendCommandToFigma,
  }
}
