import next from "@ject-5-fe/eslint/next"

export default [
  ...next,
  {
    settings: {
      tailwindcss: {
        callees: ["classnames", "clsx", "ctl", "cn"],
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
