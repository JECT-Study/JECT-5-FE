import "./index.css"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./App.tsx"

const a: any = 7

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
