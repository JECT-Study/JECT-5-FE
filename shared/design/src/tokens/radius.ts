import { convertNameToVar } from "./utils"
import variables from "./variables.json"

const primitive = variables.collections.find((c) => c.name === "primitive")
const semantic = variables.collections.find((c) => c.name === "semantic")

if (!primitive || !semantic) {
  throw new Error("Collection not found")
}

export const generateRadiusTokens = () => {
  const theme: { [key: string]: string } = {}
  const vars = semantic.modes[0].variables
  for (const v of vars) {
    if (
      typeof v.name === "string" &&
      v.name.startsWith("border radius/") &&
      v.type === "number" &&
      v.isAlias === true &&
      typeof v.value === "object" &&
      v.value !== null &&
      "name" in v.value
    ) {
      const key = v.name.split("border-radius-")[1]
      const ref = (v.value as { name: string }).name
      if (typeof key === "string") {
        theme[key] = ref.endsWith("/0") ? "0" : convertNameToVar(ref)
      }
    }
  }
  return { theme }
}

export const generateRadiusCssVars = () => {
  const vars: { [key: string]: string } = {}
  const sema = semantic.modes[0].variables
  for (const v of sema) {
    if (
      typeof v.name === "string" &&
      v.name.startsWith("border radius/") &&
      v.type === "number" &&
      v.isAlias === true &&
      typeof v.value === "object" &&
      v.value !== null &&
      "name" in v.value
    ) {
      const key = v.name.split("border-radius-")[1]
      const ref = (v.value as { name: string }).name
      if (typeof key === "string") {
        vars[`--radius-${key}`] = ref.endsWith("/0")
          ? "0"
          : convertNameToVar(ref)
      }
    }
  }
  return vars
}
