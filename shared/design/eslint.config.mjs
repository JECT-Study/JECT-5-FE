// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import base from "@ject-5-fe/eslint/base"
import storybook from "eslint-plugin-storybook"

export default [
  ...base,
  ...storybook.configs["flat/recommended"],
  {
    files: ["**/*.stories.tsx"],
    rules: {
      "storybook/csf-component": "error",
      "storybook/default-exports": "off",
    },
  },
  {
    settings: {
      tailwindcss: {
        callees: ["cva", "clsx", "ctl", "cn"],
        config: "./tailwind.config.ts",
      },
    },
    rules: {
      "tailwindcss/no-custom-classname": [
        "error",
        {
          config: "./tailwind.config.ts",
        },
      ],
    },
  },
]
