import type { Config } from "tailwindcss"
const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../shared/design/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
}
export default config
