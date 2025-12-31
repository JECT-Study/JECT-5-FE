const DEFAULT_KEY = "entry"

export const saveEntry = (key: string = DEFAULT_KEY, value?: string) => {
  if (typeof window === "undefined") return
  const entry = value ?? `${window.location.pathname}${window.location.search}`
  sessionStorage.setItem(key, entry)
}

export const getEntry = (key: string = DEFAULT_KEY) => {
  if (typeof window === "undefined") return null
  return sessionStorage.getItem(key)
}

export const clearEntry = (key: string = DEFAULT_KEY) => {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(key)
}

export const ENTRY_KEYS = {
  game: "entry:game",
  auth: "entry:auth",
} as const
