import { convertNameToVar } from "./utils"
import variables from "./variables.json"

const semantic = variables.collections.find((c) => c.name === "semantic")

if (!semantic) {
  throw new Error("Collection not found")
}

export const generateWidthTokens = () => {
  const theme: Record<string, string> = {}
  const vars = semantic.modes[0]?.variables ?? []

  for (const v of vars) {
    if (
      typeof v.name === "string" &&
      v.name.startsWith("border width/") &&
      v.type === "number" &&
      v.isAlias === true &&
      typeof v.value === "object" &&
      v.value !== null &&
      "name" in v.value
    ) {
      const key = v.name.split("border-width-")[1]
      const ref = (v.value as { name: string }).name
      if (typeof key === "string") {
        theme[key] = ref.endsWith("/0") ? "0" : convertNameToVar(ref)
      }
    }
  }

  return { theme }
}
