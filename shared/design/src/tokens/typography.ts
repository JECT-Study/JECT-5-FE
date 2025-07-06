import type { CSSRuleObject } from "tailwindcss/types/config"

import { convertName, pxToRemFixed } from "./utils"
import variables from "./variables.json"

const typographyCollection = variables.collections.find(
  (collection) => collection.name === "Typography",
)

export const generateTypographyTokens = () => {
  const theme = typographyCollection?.modes[0].variables.reduce(
    (acc, variable) => {
      if (
        variable.type !== "typography" ||
        typeof variable.value !== "object" ||
        !("fontSize" in variable.value) //to check whether value is consist of font css rules
      ) {
        throw new Error("typography value is not object")
      }
      {
        const name = convertName(variable.name)
        const value = variable.value
        const result = {
          fontSize: pxToRemFixed(value.fontSize) + "rem",
          lineHeight: Math.trunc(value.lineHeight) + "%",
          letterSpacing: String(value.letterSpacing || "0"),
          fontWeight:
            "var(--font-weight-" + value.fontWeight.toLowerCase() + ")",
        } satisfies CSSRuleObject
        acc[name] = result
        return acc
      }
    },
    {} as { [key: string]: CSSRuleObject },
  )

  return { theme }
}

export const fontWeightTokens = {
  "--font-weight-regular": "400",
  "--font-weight-medium": "500",
  "--font-weight-semibold": "600",
  "--font-weight-bold": "700",
}
