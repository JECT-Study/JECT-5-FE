export function sanitizeForPostMessage(value: unknown): unknown {
  const isMixed = (v: unknown) => {
    try {
      return typeof figma !== "undefined" && v === figma.mixed
    } catch {
      return false
    }
  }

  if (isMixed(value)) return "[mixed]"
  if (typeof value === "symbol") return value.toString()
  if (typeof value === "bigint") return value.toString()

  if (value === null) return null
  if (value === undefined) return undefined

  if (Array.isArray(value)) {
    return value.map((v) => sanitizeForPostMessage(v))
  }

  if (typeof value === "object") {
    if (value instanceof Date) return value.toISOString()
    if (value instanceof RegExp) return value.toString()

    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = sanitizeForPostMessage(v)
    }
    return out
  }

  return value
}
