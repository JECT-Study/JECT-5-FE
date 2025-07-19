/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"

interface ConnectionState {
  connected: boolean
  port: number
  socket: WebSocket | null
}

const App = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    connected: false,
    port: 3055,
    socket: null,
  })
  const [selectionData, setSelectionData] = useState<any>(null)
  const [status, setStatus] = useState("Disconnected")

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("복사 실패:", err)
    }
  }

  // 플러그인으로부터 메시지 받기
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data.pluginMessage
      if (!message) return

      switch (message.type) {
        case "SELECTION_DATA":
          setSelectionData(message.data)
          break
        case "connection-status":
          setStatus(message.connected ? "Connected" : message.message)
          break
        case "command-result":
          // MCP 명령 결과를 WebSocket으로 전송
          sendToWebSocket({
            id: message.id,
            result: message.result,
          })
          break
        case "command-error":
          // MCP 명령 에러를 WebSocket으로 전송
          sendToWebSocket({
            id: message.id,
            error: message.error,
          })
          break
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [connectionState.socket])

  // WebSocket 연결
  const connectToServer = async () => {
    try {
      if (connectionState.connected && connectionState.socket) {
        setStatus("Already connected")
        return
      }

      const ws = new WebSocket(`ws://localhost:${connectionState.port}`)

      ws.onopen = () => {
        console.log("Connected to WebSocket server")
        setConnectionState((prev) => ({
          ...prev,
          socket: ws,
          connected: true,
        }))
        setStatus("Connected to server")
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log("Received WebSocket message:", data)

          if (data.type === "broadcast" && data.message?.command) {
            // MCP 서버로부터 명령 받음
            parent.postMessage(
              {
                pluginMessage: {
                  type: "execute-command",
                  id: data.message.id,
                  command: data.message.command,
                  params: data.message.params,
                },
              },
              "*",
            )
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      ws.onclose = () => {
        setConnectionState((prev) => ({
          ...prev,
          connected: false,
          socket: null,
        }))
        setStatus("Disconnected")
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        setStatus("Connection error")
      }
    } catch (error) {
      console.error("Connection error:", error)
      setStatus(`Connection error: ${error}`)
    }
  }

  // WebSocket 연결 해제
  const disconnect = () => {
    if (connectionState.socket) {
      connectionState.socket.close()
    }
  }

  // WebSocket으로 메시지 전송
  const sendToWebSocket = (message: any) => {
    if (connectionState.socket) {
      connectionState.socket.send(
        JSON.stringify({
          type: "message",
          message,
        }),
      )
    }
  }

  return (
    <div style={{ padding: "16px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "16px", marginBottom: "18px" }}>
        Figma MCP Plugin
      </h1>

      <div style={{ marginBottom: "16px" }}>
        <label
          style={{ display: "block", marginBottom: "8px", fontSize: "12px" }}
        >
          WebSocket Server Port
        </label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="number"
            value={connectionState.port}
            onChange={(e) =>
              setConnectionState((prev) => ({
                ...prev,
                port: parseInt(e.target.value) || 3055,
              }))
            }
            style={{
              margin: "1px 0",
              display: "flex",
              backgroundColor: "var(--figma-color-bg-secondary)",
              border: "1px solid transparent",
              height: "var(--spacer-4)",
              borderRadius: "var(--radius-medium)",
              alignItems: "center",
              flex: 1,
              padding: "0 7px",
              borderLeft: 0,
              borderRight: 0,
              backgroundClip: "padding-box",
              marginLeft: 0,
              width: "100%",
              fontSize: "12px",
            }}
            disabled={connectionState.connected}
          />
          <button
            onClick={connectionState.connected ? disconnect : connectToServer}
            style={{
              display: "block",
              borderRadius: "5px",
              border: "1px solid var(--figma-color-border)",
              padding: "0 7px",
              lineHeight: "22px",
              textDecoration: "none",
              color: "var(--figma-color-text)",
              backgroundColor: connectionState.connected
                ? "#dc2626"
                : "#2563eb",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            {connectionState.connected ? "Disconnect" : "Connect"}
          </button>
        </div>
      </div>

      <div
        style={{
          padding: "12px",
          borderRadius: "4px",
          backgroundColor: connectionState.connected ? "#dcfce7" : "#fee2e2",
          color: connectionState.connected ? "#166534" : "#991b1b",
          fontSize: "12px",
          marginBottom: "16px",
        }}
      >
        Status: {status}
      </div>

      {selectionData && (
        <div style={{ marginTop: "16px" }}>
          <h3
            style={{
              fontSize: "14px",
              marginBottom: "8px",
              color: "var(--figma-color-text)",
            }}
          >
            XML Output:
          </h3>
          <pre
            style={{
              fontSize: "11px",
              backgroundColor: "var(--figma-color-bg-secondary)",
              border: "1px solid var(--figma-color-border)",
              padding: "12px",
              borderRadius: "var(--radius-medium)",
              maxHeight: "150px",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontFamily: "monospace",
            }}
          >
            {selectionData.xml?.join("\n\n")}
          </pre>

          <h3
            style={{
              fontSize: "14px",
              marginBottom: "8px",
              marginTop: "16px",
              color: "var(--figma-color-text)",
            }}
          >
            React Nodes:
          </h3>
          <pre
            style={{
              fontSize: "10px",
              backgroundColor: "var(--figma-color-bg-secondary)",
              border: "1px solid var(--figma-color-border)",
              padding: "12px",
              borderRadius: "var(--radius-medium)",
              maxHeight: "150px",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontFamily: "monospace",
              color: "var(--figma-color-text-secondary)",
            }}
          >
            {JSON.stringify(selectionData.reactNodes, null, 2)}
          </pre>

          <h3
            style={{
              fontSize: "14px",
              marginBottom: "8px",
              marginTop: "16px",
              color: "var(--figma-color-text)",
            }}
          >
            Variables:
          </h3>
          <pre
            style={{
              fontSize: "10px",
              backgroundColor: "var(--figma-color-bg-secondary)",
              border: "1px solid var(--figma-color-border)",
              padding: "12px",
              borderRadius: "var(--radius-medium)",
              maxHeight: "150px",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontFamily: "monospace",
              color: "var(--figma-color-text-secondary)",
            }}
          >
            {JSON.stringify(selectionData.variables, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default App
