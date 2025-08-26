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

// 파일 검증 로직
export interface FileValidationOptions {
  accept?: string
  maxFiles?: number
  maxSize?: number
  currentFileCount?: number
}

export interface FileValidationResult {
  isValid: boolean
  error?: string
}

export function validateFile(
  file: File,
  options: FileValidationOptions,
): FileValidationResult {
  const { accept, maxSize } = options

  if (accept) {
    const acceptTypes = accept.split(",").map((t) => t.trim())
    const fileType = file.type
    const fileExtension = `.${file.name.split(".").pop()}`

    const isAccepted = acceptTypes.some(
      (type) =>
        type === fileType ||
        type === fileExtension ||
        (type.includes("/*") && fileType.startsWith(type.replace("/*", "/"))),
    )

    if (!isAccepted) {
      return {
        isValid: false,
        error: "File type not accepted",
      }
    }
  }

  if (maxSize && file.size > maxSize) {
    return {
      isValid: false,
      error: "File too large",
    }
  }

  return { isValid: true }
}

export function validateFiles(
  files: File[],
  options: FileValidationOptions,
): {
  validFiles: File[]
  invalidFiles: Array<{ file: File; error: string }>
} {
  const { maxFiles, currentFileCount = 0 } = options
  const validFiles: File[] = []
  const invalidFiles: Array<{ file: File; error: string }> = []

  // 최대 파일 수 검증
  if (maxFiles) {
    const remainingSlots = Math.max(0, maxFiles - currentFileCount)
    if (files.length > remainingSlots) {
      const excessFiles = files.slice(remainingSlots)
      for (const file of excessFiles) {
        invalidFiles.push({
          file,
          error: `Maximum ${maxFiles} files allowed`,
        })
      }
      files = files.slice(0, remainingSlots)
    }
  }

  // 개별 파일 검증
  for (const file of files) {
    const validation = validateFile(file, options)
    if (validation.isValid) {
      validFiles.push(file)
    } else {
      invalidFiles.push({
        file,
        error: validation.error!,
      })
    }
  }

  return { validFiles, invalidFiles }
}
