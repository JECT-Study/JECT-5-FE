import { type FileValidator } from "../types"

/**
 * 파일 검증 결과 타입
 */
export interface ValidationResult {
  /** 검증을 통과한 파일들 */
  acceptedFiles: File[]
  /** 검증에 실패한 파일들과 에러 메시지 */
  rejectedFiles: Array<{ file: File; message: string }>
  /** 전체 검증 실패 여부 */
  hasInvalid: boolean
}

/**
 * 파일 검증 옵션
 */
export interface ValidationOptions {
  /** 허용되는 파일 타입 배열 */
  acceptTypes?: string[] | null
  /** 최대 파일 크기 (bytes) */
  maxSize?: number
  /** 최대 파일 개수 */
  maxFiles?: number
  /** 현재 파일 개수 */
  currentFileCount?: number
  /** 커스텀 검증 함수 */
  validator?: FileValidator
  /** 파일 거부 시 호출될 콜백 */
  onFileReject?: (file: File, message: string) => void
}

/**
 * 파일 타입이 허용되는지 확인
 */
function isFileTypeAccepted(file: File, acceptTypes: string[]): boolean {
  const fileType = file.type
  const fileExtension = `.${file.name.split(".").pop()}`

  return acceptTypes.some(
    (type) =>
      type === fileType ||
      type === fileExtension ||
      (type.includes("/*") && fileType.startsWith(type.replace("/*", "/"))),
  )
}

/**
 * 개별 파일을 검증하는 함수
 */
function validateSingleFile(
  file: File,
  options: ValidationOptions,
): { isValid: boolean; message: string } {
  const { acceptTypes, maxSize, validator } = options

  // 커스텀 검증 함수 먼저 실행
  if (validator) {
    const validationMessage = validator(file)
    if (validationMessage) {
      return { isValid: false, message: validationMessage }
    }
  }

  // 파일 타입 검증
  if (acceptTypes && !isFileTypeAccepted(file, acceptTypes)) {
    return { isValid: false, message: "File type not accepted" }
  }

  // 파일 크기 검증
  if (maxSize && file.size > maxSize) {
    return { isValid: false, message: "File too large" }
  }

  return { isValid: true, message: "" }
}

/**
 * 최대 파일 개수 제한 검증
 */
function validateFileCount(
  files: File[],
  maxFiles: number,
  currentFileCount: number,
): {
  filesToProcess: File[]
  rejectedFiles: File[]
  hasInvalid: boolean
} {
  const remainingSlotCount = Math.max(0, maxFiles - currentFileCount)

  if (remainingSlotCount >= files.length) {
    return {
      filesToProcess: files,
      rejectedFiles: [],
      hasInvalid: false,
    }
  }

  return {
    filesToProcess: files.slice(0, remainingSlotCount),
    rejectedFiles: files.slice(remainingSlotCount),
    hasInvalid: true,
  }
}

/**
 * 파일 배열을 검증하는 메인 함수
 */
export function validateFiles(
  files: File[],
  options: ValidationOptions = {},
): ValidationResult {
  const { maxFiles, currentFileCount = 0, validator, onFileReject } = options

  let filesToProcess = [...files]
  let hasInvalid = false
  const rejectedFiles: Array<{ file: File; message: string }> = []

  // 1. 파일 개수 제한 검증
  if (maxFiles) {
    const countValidation = validateFileCount(
      filesToProcess,
      maxFiles,
      currentFileCount,
    )

    filesToProcess = countValidation.filesToProcess
    hasInvalid = countValidation.hasInvalid

    // 개수 제한으로 거부된 파일들 처리
    for (const file of countValidation.rejectedFiles) {
      let rejectionMessage = `Maximum ${maxFiles} files allowed`

      // 커스텀 검증 함수가 있다면 우선 적용
      if (validator) {
        const validationMessage = validator(file)
        if (validationMessage) {
          rejectionMessage = validationMessage
        }
      }

      rejectedFiles.push({ file, message: rejectionMessage })
      onFileReject?.(file, rejectionMessage)
    }
  }

  // 2. 개별 파일 검증
  const acceptedFiles: File[] = []

  for (const file of filesToProcess) {
    const validation = validateSingleFile(file, options)

    if (validation.isValid) {
      acceptedFiles.push(file)
    } else {
      rejectedFiles.push({ file, message: validation.message })
      onFileReject?.(file, validation.message)
      hasInvalid = true
    }
  }

  return {
    acceptedFiles,
    rejectedFiles,
    hasInvalid,
  }
}

/**
 * 단일 파일 검증을 위한 헬퍼 함수
 */
export function validateFile(
  file: File,
  options: Omit<ValidationOptions, "maxFiles" | "currentFileCount"> = {},
): { isValid: boolean; message: string } {
  return validateSingleFile(file, options)
}
