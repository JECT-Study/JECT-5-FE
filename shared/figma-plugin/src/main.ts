// Read the docs https://plugma.dev/docs
import {
  frameNodeToReactNode,
  groupNodeToReactNode,
  instanceNodeToReactNode,
  rectangleNodeToReactNode,
  textNodeToReactNode,
} from "./utils/node"

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
      const selection = figma.currentPage.selection

      let reactNodes: any[] = []
      const allUsedVariables = new Map<string, any>()

      if (selection.length > 0) {
        reactNodes = await Promise.all(
          selection.map((node) => figmaNodeToReactNode(node)),
        )

        for (const node of selection) {
          await collectUsedVariables(node, allUsedVariables)
        }
      }

      const variablesData = Object.fromEntries(allUsedVariables)

      // React Node를 XML로 변환하는 함수
      const reactNodeToXML = (node: any, indent = 0): string => {
        const { type, props, children } = node
        const spaces = "  ".repeat(indent)
        let xml = `${spaces}<${type}`

        // props를 attributes로 변환
        if (props) {
          Object.entries(props).forEach(([key, value]) => {
            if (value !== undefined && value !== null && key !== "children") {
              let strValue = ""
              if (typeof value === "string") {
                strValue = value
              } else if (typeof value === "object") {
                strValue = JSON.stringify(value)
              } else {
                strValue = String(value)
              }
              xml += `\n${spaces}  ${key}="${strValue}"`
            }
          })
        }

        if (!children || (Array.isArray(children) && children.length === 0)) {
          xml += " />"
        } else {
          xml += ">"

          if (typeof children === "string") {
            xml += `\n${spaces}  ${children}\n${spaces}`
          } else if (Array.isArray(children)) {
            xml += "\n"
            children.forEach((child) => {
              xml += reactNodeToXML(child, indent + 1) + "\n"
            })
            xml += spaces
          }

          xml += `</${type}>`
        }

        return xml
      }

      const xmlData = reactNodes.map((node) => reactNodeToXML(node))
      figma.ui.postMessage({
        type: "SELECTION_DATA",
        data: {
          reactNodes,
          variables: variablesData,
          xml: xmlData,
        },
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

  async function getSelection() {
    const selection = figma.currentPage.selection

    let reactNodes: any[] = []
    const allUsedVariables = new Map<string, any>()

    if (selection.length > 0) {
      reactNodes = await Promise.all(
        selection.map((node) => figmaNodeToReactNode(node)),
      )

      for (const node of selection) {
        await collectUsedVariables(node, allUsedVariables)
      }
    }

    const variablesData = Object.fromEntries(allUsedVariables)

    // React Node를 XML로 변환하는 함수
    const reactNodeToXML = (node: any, indent = 0): string => {
      const { type, props, children } = node
      const spaces = "  ".repeat(indent)
      let xml = `${spaces}<${type}`

      // props를 attributes로 변환
      if (props) {
        Object.entries(props).forEach(([key, value]) => {
          if (value !== undefined && value !== null && key !== "children") {
            let strValue = ""
            if (typeof value === "string") {
              strValue = value
            } else if (typeof value === "object") {
              strValue = JSON.stringify(value)
            } else {
              strValue = String(value)
            }
            xml += `\n${spaces}  ${key}="${strValue}"`
          }
        })
      }

      if (!children || (Array.isArray(children) && children.length === 0)) {
        xml += " />"
      } else {
        xml += ">"

        if (typeof children === "string") {
          xml += `\n${spaces}  ${children}\n${spaces}`
        } else if (Array.isArray(children)) {
          xml += "\n"
          children.forEach((child) => {
            xml += reactNodeToXML(child, indent + 1) + "\n"
          })
          xml += spaces
        }

        xml += `</${type}>`
      }

      return xml
    }

    const xmlData = reactNodes.map((node) => reactNodeToXML(node))

    return {
      selectionCount: selection.length,
      selection: selection.map((node) => ({
        id: node.id,
        name: node.name,
        type: node.type,
        visible: node.visible,
      })),
      reactNodes,
      variables: variablesData,
      xml: xmlData,
    }
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

  const figmaNodeToReactNode = async (figmaNode: SceneNode): Promise<any> => {
    let node: any
    switch (figmaNode.type) {
      case "INSTANCE": // 아이콘도 이 타입에 포함
        node = await instanceNodeToReactNode(figmaNode)
        break
      case "FRAME":
        node = await frameNodeToReactNode(figmaNode)
        break
      case "TEXT":
        node = await textNodeToReactNode(figmaNode)
        break
      case "RECTANGLE":
        node = await rectangleNodeToReactNode(figmaNode)
        break
      case "GROUP":
        node = await groupNodeToReactNode(figmaNode)
        break

      default:
        node = {
          type: figmaNode.type,
          props: {
            id: figmaNode.id,
            name: figmaNode.name,
          },
          children:
            "children" in figmaNode && figmaNode.children
              ? figmaNode.children
              : [],
        }
    }

    if (
      node.children &&
      Array.isArray(node.children) &&
      node.children.length > 0
    ) {
      node.children = await Promise.all(
        node.children
          .filter((child: SceneNode) => child.visible)
          .map((child: SceneNode) => figmaNodeToReactNode(child)),
      )
    }

    return node
  }

  const resolveVariableValue = async (variableId: string) => {
    try {
      const variable = await figma.variables.getVariableByIdAsync(variableId)
      if (!variable) return null

      return {
        id: variable.id,
        name: variable.codeSyntax.WEB,
      }
    } catch (error) {
      return { error: `Error resolving variable: ${error}` }
    }
  }

  const collectUsedVariables = async (
    node: SceneNode,
    variableMap: Map<string, any> = new Map(),
  ): Promise<Map<string, any>> => {
    if (!node.boundVariables) return variableMap

    for (const [property, aliases] of Object.entries(node.boundVariables)) {
      const aliasList = Array.isArray(aliases) ? aliases : [aliases]

      for (const alias of aliasList) {
        if (alias?.type === "VARIABLE_ALIAS" && alias.id) {
          const variable = await resolveVariableValue(alias.id as string)
          if (variable?.id && variable.name) {
            const existing = variableMap.get(variable.id)
            variableMap.set(variable.id, {
              id: variable.id,
              name: variable.name,
              usedIn: [...(existing?.usedIn || []), `${node.name}.${property}`],
            })
          }
        }
      }
    }

    if ("children" in node && node.children) {
      for (const child of node.children) {
        if (child.visible) {
          await collectUsedVariables(child, variableMap)
        }
      }
    }

    return variableMap
  }
}
