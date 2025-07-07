import config from "@ject-5-fe/design/tailwind.config"
export default {
  ...config,
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../shared/design/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
}
