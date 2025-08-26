import * as React from "react"

export function useLazyRef<T>(fn: () => T) {
  const ref = React.useRef<T | null>(null)

  if (ref.current === null) {
    ref.current = fn()
  }

  return ref as React.MutableRefObject<T>
}

export function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B"
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(i ? 1 : 0)} ${sizes[i]}`
}
