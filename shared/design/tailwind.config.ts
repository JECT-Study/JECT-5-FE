import type { Config } from "tailwindcss"

import plugin from "./src/plugin"

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {},
  plugins: [plugin],
} satisfies Config
