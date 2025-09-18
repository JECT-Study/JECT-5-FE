import { convertNameToVar } from "./utils"
import variables from "./variables.json"

const primitive = variables.collections.find((c) => c.name === "primitive")

export const generateUnitTokens = () => {
  const list = primitive?.modes?.[0]?.variables ?? []
  const cssVars: Record<string, string> = {}
  const theme: Record<string, string> = {}
  for (const v of list) {
    if (
      typeof v.name === "string" &&
      v.name.startsWith("unit/") &&
      v.type === "number" &&
      typeof v.value === "number"
    ) {
      const key = String(v.name.split("/")[1])
      const px = v.value
      cssVars[`--unit-${key}`] = key === "0" ? "0" : String(px) + "px"
      theme[key] = key === "0" ? "0" : convertNameToVar(v.name)
    }
  }
  return { cssVars, theme }
}
