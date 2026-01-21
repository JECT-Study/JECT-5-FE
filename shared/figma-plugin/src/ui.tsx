import "./styles.css"

import { createRoot } from "react-dom/client"

import App from "./app.tsx"

createRoot(document.getElementById("plugin")!).render(<App />)
