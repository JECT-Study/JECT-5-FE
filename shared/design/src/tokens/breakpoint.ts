import variables from "./variables.json"

const primitive = variables.collections.find((c) => c.name === "primitive")

if (!primitive) {
  throw new Error("Collection not found")
}

export const generateBreakpointTokens = () => {
  const theme: Record<string, string> = {}
  const vars = primitive.modes[0]?.variables ?? []

  for (const v of vars) {
    if (
      typeof v.name === "string" &&
      v.name.startsWith("breakpoint/") &&
      v.type === "number" &&
      v.isAlias === false &&
      typeof v.value === "number"
    ) {
      const key = v.name.split("breakpoint/")[1]
      if (typeof key === "string" && key.length > 0) {
        theme[key] = `${v.value}px`
      }
    }
  }

  return { theme }
}
