/** @type {import("prettier").Config} */

module.exports = {
  semi: false,
  singleQuote: false,
  tailwindConfig: "./shared/design/tailwind.config.ts",
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
}
