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
  const [designData, setDesignData] = useState<any>(null)
  const [status, setStatus] = useState("Disconnected")

  // 플러그인으로부터 메시지 받기
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data.pluginMessage
      if (!message) return

      switch (message.type) {
        case "DESIGN_DATA":
          setDesignData(message.data)
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
              flex: 1,
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "12px",
            }}
            disabled={connectionState.connected}
          />
          <button
            onClick={connectionState.connected ? disconnect : connectToServer}
            style={{
              padding: "6px 12px",
              backgroundColor: connectionState.connected
                ? "#dc2626"
                : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              cursor: "pointer",
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

      {designData && (
        <div style={{ marginTop: "16px" }}>
          <h3 style={{ fontSize: "14px", marginBottom: "8px" }}>
            Selection Data:
          </h3>
          <pre
            style={{
              fontSize: "10px",
              backgroundColor: "#f3f4f6",
              padding: "8px",
              borderRadius: "4px",
              maxHeight: "400px",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {JSON.stringify(designData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default App
