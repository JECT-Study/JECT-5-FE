const packages = [
  { name: "@ject-5-fe/app", parent: "service/app" },
  { name: "@ject-5-fe/design", parent: "shared/design" },
]

const typeCheckConfigs = packages.reduce(
  (prev, { name, parent }) => ({
    ...prev,
    [`./${parent}/**/*.{ts,tsx}`]: (filename) => [
      `yarn workspace ${name} lint ${filename.join(" ")}`,
      `yarn workspace ${name} type-check`,
    ],
  }),
  {},
)

module.exports = {
  "**/*.{js,jsx,ts,tsx,json,css,md}": "prettier --write",
  ...typeCheckConfigs,
}
