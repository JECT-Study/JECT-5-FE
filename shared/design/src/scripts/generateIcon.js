import { transform } from "@svgr/core"
import * as fs from "fs"
import path from "path"

import iconData from "../icons/icon.json" with { type: "json" }

// 아이콘들을 저장할 배열
const generatedIcons = []

Object.keys(iconData).forEach((_icon) => {
  const icon = _icon //as keyof typeof iconData
  const componentName = icon[0].toUpperCase() + icon.slice(1)

  // 생성된 아이콘 이름 저장
  generatedIcons.push({ fileName: icon, componentName })

  // SVG에서 모든 fill 속성 제거 (fill="any_color", fill='any_color' 등)
  const cleanedSvg = iconData[icon].svg.replace(/fill=(["'])[^"']*\1/g, "")

  transform(
    cleanedSvg,
    {
      template: (variables, context) => {
        return context.tpl`
        import { forwardRef, type Ref, type SVGProps } from "react"

        const ${variables.componentName} = (
          { size = 24,...props }: SVGProps<SVGSVGElement> & { size?: number | string },
          ref: Ref<SVGSVGElement>
        ) => (
          ${variables.jsx}
        );

        ${variables.exports}
      `
      },
      jsxRuntime: "classic",
      typescript: true,
      ref: true,
      icon: true,
      svgProps: {
        width: "{size}",
        height: "{size}",
        fill: "currentColor",
      },
      plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
    },
    { componentName },
  ).then((code) => {
    fs.writeFileSync(
      path.join(import.meta.dirname, `../icons/${icon}.tsx`),
      code,
      "utf-8",
    )
  })
})

// 모든 아이콘 정보 수집 완료 후 barrel file 생성
const barrelFileContent = generatedIcons
  .map(({ fileName, componentName }) => {
    return `export { default as ${componentName} } from "./${fileName}"`
  })
  .join("\n")

fs.writeFileSync(
  path.join(import.meta.dirname, "../icons/index.ts"),
  barrelFileContent + "\n",
  "utf-8",
)
