import base from "@ject-5-fe/eslint/base"

export default [
  ...base,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]
