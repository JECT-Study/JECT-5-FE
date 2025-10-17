import { trim } from "es-toolkit"
import { replace, toLower } from "es-toolkit/compat"

export const normalize = (s: string) => replace(toLower(trim(s)), /\s+/g, "")

export const filterInput = (a: string, b: string) =>
  normalize(a)?.includes(normalize(b))
