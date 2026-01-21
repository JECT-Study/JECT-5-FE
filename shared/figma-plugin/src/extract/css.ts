export const collectCss = async (node: SceneNode): Promise<string | undefined> => {
  if ("getCSSAsync" in node && typeof node.getCSSAsync === "function") {
    try {
      const cssResult: unknown = await node.getCSSAsync()

      if (typeof cssResult === "string") {
        return cssResult
      }

      if (cssResult && typeof cssResult === "object") {
        try {
          return JSON.stringify(cssResult)
        } catch (stringifyError) {
          console.warn("CSS serialization skipped:", stringifyError)
        }
      }
    } catch (error) {
      console.warn("CSS extraction skipped:", error)
    }
  }

  return undefined
}
