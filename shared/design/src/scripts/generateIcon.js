import { transform } from "@svgr/core"
import * as fs from "fs"
import path from "path"

import iconData from "../icons/icon.json" with { type: "json" }

Object.keys(iconData).forEach((_icon) => {
  const icon = _icon //as keyof typeof iconData
  transform(
    iconData[icon].svg,
    {
      template: (variables, context) => {
        return context.tpl`
        import { forwardRef, type Ref, type SVGProps } from "react"

        const ${variables.componentName} = (
          { size = 24, ...props }: SVGProps<SVGSVGElement> & { size?: number | string },
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
      },
      plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
    },
    { componentName: icon[0].toUpperCase() + icon.slice(1) },
  ).then((code) => {
    fs.writeFileSync(
      path.join(import.meta.dirname, `../icons/${icon}.tsx`),
      code,
      "utf-8",
    )
  })
})
