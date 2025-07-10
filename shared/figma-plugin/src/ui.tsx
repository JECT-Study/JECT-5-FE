import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./App.tsx"

createRoot(document.getElementById("plugin")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
