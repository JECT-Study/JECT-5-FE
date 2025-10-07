import type { Config } from "tailwindcss"

import plugin from "./src/plugin"

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["var(--font-pretendard)"],
        joyofsinging: ["var(--font-joyofsinging)"],
      },
    },
  },
  plugins: [plugin],
} satisfies Config
