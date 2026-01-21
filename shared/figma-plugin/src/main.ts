// Read the docs https://plugma.dev/docs

import { figmaNodeToReactNode } from "./convert"
import type { SelectionDataPayload } from "./types/figmaNode"
import {
  formatVariableUsageRecord,
  resolveVariableUsageFromReactNodes,
} from "./utils/variables/variableUsage"

// WebSocket 상태 관리
const state = {
  serverPort: 3055,
  connected: false,
  socket: null,
  pendingRequests: new Map(),
  channel: null as string | null,
}

export default function () {
  figma.showUI(__html__, { width: 300, height: 260, themeColors: true })

  // UI로부터 메시지 처리
  figma.ui.onmessage = async (msg) => {
    switch (msg.type) {
      case "connect-websocket":
        await connectToServer(msg.port || 3055)
        break
      case "disconnect-websocket":
        disconnectFromServer()
        break
      case "execute-command":
        // MCP 서버로부터의 명령 실행
        try {
          const result = await handleCommand(msg.command, msg.params)
          figma.ui.postMessage({
            type: "command-result",
            id: msg.id,
            result,
          })
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error"
          figma.ui.postMessage({
            type: "command-error",
            id: msg.id,
            error: errorMessage || null,
          })
        }
        break
    }
  }

  async function handleSelectionChange() {
    try {
      const data = await getSelection()

      figma.ui.postMessage({
        type: "SELECTION_DATA",
        data,
      })
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error"
      console.error("선택 읽기 오류:", errorMessage)

      figma.ui.postMessage({
        type: "ERROR",
        message: errorMessage,
      })
    }
  }

  figma.on("selectionchange", handleSelectionChange)

  // WebSocket 서버 연결
  async function connectToServer(port: number) {
    try {
      if (state.connected && state.socket) {
        figma.ui.postMessage({
          type: "connection-status",
          connected: true,
          message: "Already connected to server",
        })
        return
      }

      state.serverPort = port
      figma.ui.postMessage({
        type: "connection-status",
        connected: false,
        message: "WebSocket connection must be handled by UI",
      })
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error"
      figma.ui.postMessage({
        type: "connection-status",
        connected: false,
        message: `Connection error: ${errorMessage}`,
      })
    }
  }

  // WebSocket 연결 해제
  function disconnectFromServer() {
    if (state.socket) {
      state.socket = null
      state.connected = false
      figma.ui.postMessage({
        type: "connection-status",
        connected: false,
        message: "Disconnected from server",
      })
    }
  }

  async function handleCommand(command: string, params: any) {
    switch (command) {
      case "get_document_info":
        return await getDocumentInfo()
      case "get_selection":
        return await getSelection()
      case "get_node_info":
        if (!params?.nodeId) throw new Error("Missing nodeId parameter")
        return await getNodeInfo(params.nodeId)
      case "export_icons_from_frame":
        return await exportIcons({
          pageName: params?.pageName ?? "컴포넌트",
          frameName: params?.frameName ?? "아이콘",
          ignoreFrameChildren: true,
        })
      default:
        throw new Error(`Unknown command: ${command}`)
    }
  }

  // Figma API 래퍼 함수들
  async function getDocumentInfo() {
    await figma.currentPage.loadAsync()
    const page = figma.currentPage
    return {
      name: page.name,
      id: page.id,
      type: page.type,
      children: page.children.map((node) => ({
        id: node.id,
        name: node.name,
        type: node.type,
      })),
      currentPage: {
        id: page.id,
        name: page.name,
        childCount: page.children.length,
      },
    }
  }

  async function getSelection(): Promise<SelectionDataPayload> {
    const selection = figma.currentPage.selection

    const reactNodes = await Promise.all(
      selection.map((node) => figmaNodeToReactNode(node)),
    )

    const variablesMap = await resolveVariableUsageFromReactNodes(reactNodes)
    const variablesData = formatVariableUsageRecord(variablesMap)

    const payload: SelectionDataPayload = {
      selectionCount: selection.length,
      selection: selection.map((node) => ({
        id: node.id,
        name: node.name,
        type: node.type,
        visible: node.visible,
      })),
      reactNodes,
      variables: variablesData,
    }

    return payload
  }

  async function getNodeInfo(nodeId: string) {
    const node = await figma.getNodeByIdAsync(nodeId)
    if (!node) {
      throw new Error(`Node not found with ID: ${nodeId}`)
    }

    // exportAsync를 지원하는 노드인지 확인
    if ("exportAsync" in node) {
      const response: any = await node.exportAsync({
        format: "JSON_REST_V1",
      })
      return response?.document
    } else {
      return {
        id: node.id,
        name: node.name,
        type: node.type,
        ...("visible" in node ? { visible: node.visible } : {}),
      }
    }
  }
}
