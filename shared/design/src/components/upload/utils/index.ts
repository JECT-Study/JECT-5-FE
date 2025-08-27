import { type MutableRefObject, useRef } from "react"

export function useLazyRef<T>(fn: () => T) {
  const ref = useRef<T | null>(null)

  if (ref.current === null) {
    ref.current = fn()
  }

  return ref as MutableRefObject<T>
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
        error: "지원하지 않는 파일 형식입니다",
      }
    }
  }

  if (maxSize && file.size > maxSize) {
    return {
      isValid: false,
      error: `파일 크기가 ${formatBytes(maxSize)}를 초과합니다`,
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
    const isReplacement =
      maxFiles === 1 && currentFileCount === 1 && files.length === 1
    const remainingSlots = isReplacement
      ? 1
      : Math.max(0, maxFiles - currentFileCount)

    if (files.length > remainingSlots) {
      const excessFiles = files.slice(remainingSlots)
      for (const file of excessFiles) {
        invalidFiles.push({
          file,
          error: `최대 ${maxFiles}개 파일만 업로드할 수 있습니다`,
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
