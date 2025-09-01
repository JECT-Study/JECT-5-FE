import * as React from "react"

import { type FileUploadStore, type UploadFunction } from "../types"
import { validateFiles } from "./validation"

/**
 * 진행률 업데이트를 위한 throttle 함수 생성
 */
export function createProgressThrottle() {
  let frame = 0
  return (callback: () => void) => {
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      callback()
    })
  }
}

/**
 * 파일 업로드 핸들러 생성 옵션
 */
export interface UploadHandlerOptions {
  /** 파일 업로드 스토어 */
  store: FileUploadStore
  /** 업로드 함수 */
  onUpload?: UploadFunction
  /** 진행률 업데이트 함수 */
  onProgress: (file: File, progress: number) => void
}

/**
 * 파일 업로드를 처리하는 함수
 */
export function createFilesUploadHandler(options: UploadHandlerOptions) {
  const { store, onUpload, onProgress } = options

  return async (files: File[]) => {
    try {
      // 모든 파일의 진행률을 0으로 초기화
      for (const file of files) {
        store.dispatch({ type: "SET_PROGRESS", file, progress: 0 })
      }

      if (onUpload) {
        // 사용자 정의 업로드 함수 실행
        await onUpload(files, {
          onProgress,
          onSuccess: (file) => {
            store.dispatch({ type: "SET_SUCCESS", file })
          },
          onError: (file, error) => {
            store.dispatch({
              type: "SET_ERROR",
              file,
              error: error.message ?? "Upload failed",
            })
          },
        })
      } else {
        // 기본 동작: 모든 파일을 성공 상태로 설정
        for (const file of files) {
          store.dispatch({ type: "SET_SUCCESS", file })
        }
      }
    } catch (error) {
      // 전체 업로드 실패 시 모든 파일을 에러 상태로 설정
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed"

      for (const file of files) {
        store.dispatch({
          type: "SET_ERROR",
          file,
          error: errorMessage,
        })
      }
    }
  }
}

/**
 * input change 이벤트 핸들러 생성
 */
export function createInputChangeHandler(
  onFilesChange: (files: File[]) => void,
) {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    onFilesChange(files)
    // input value를 초기화하여 같은 파일을 다시 선택할 수 있게 함
    event.target.value = ""
  }
}

/**
 * 트리거 클릭 핸들러 생성
 */
export function createTriggerClickHandler(
  inputRef: React.RefObject<HTMLInputElement>,
  onClickProp?: (event: React.MouseEvent<HTMLButtonElement>) => void,
) {
  return (event: React.MouseEvent<HTMLButtonElement>) => {
    onClickProp?.(event)

    if (event.defaultPrevented) return

    inputRef.current?.click()
  }
}

/**
 * 파일 변경 처리를 위한 옵션
 */
export interface FilesChangeHandlerOptions {
  /** 파일 업로드 스토어 */
  store: FileUploadStore
  /** 제어된 모드 여부 */
  isControlled: boolean
  /** 값 변경 콜백 */
  onValueChange?: (files: File[]) => void
  /** 파일 수락 콜백 */
  onAccept?: (files: File[]) => void
  /** 개별 파일 수락 콜백 */
  onFileAccept?: (file: File) => void
  /** 업로드 함수 */
  onUpload?: UploadFunction
  /** 비활성화 상태 */
  disabled: boolean
  /** 검증 옵션 */
  validation: {
    acceptTypes?: string[] | null
    maxSize?: number
    maxFiles?: number
    validator?: (file: File) => string | null
    onFileReject?: (file: File, message: string) => void
  }
  /** 파일 업로드 핸들러 */
  onFilesUpload: (files: File[]) => void
}

/**
 * 파일 변경 핸들러 생성
 */
export function createFilesChangeHandler(options: FilesChangeHandlerOptions) {
  const {
    store,
    isControlled,
    onValueChange,
    onAccept,
    onFileAccept,
    onUpload,
    disabled,
    validation,
    onFilesUpload,
  } = options

  return (originalFiles: File[]) => {
    if (disabled) return

    // 현재 파일 개수 조회
    const currentFileCount = store.getState().files.size

    // 파일 검증 실행
    const validationResult = validateFiles(originalFiles, {
      acceptTypes: validation.acceptTypes,
      maxSize: validation.maxSize,
      maxFiles: validation.maxFiles,
      currentFileCount,
      validator: validation.validator,
      onFileReject: validation.onFileReject,
    })

    const { acceptedFiles, hasInvalid } = validationResult

    // 검증 실패 시 invalid 상태 설정 (2초 후 자동 해제)
    if (hasInvalid) {
      store.dispatch({ type: "SET_INVALID", invalid: true })
      setTimeout(() => {
        store.dispatch({ type: "SET_INVALID", invalid: false })
      }, 2000)
    }

    // 수락된 파일들 처리
    if (acceptedFiles.length > 0) {
      store.dispatch({ type: "ADD_FILES", files: acceptedFiles })

      // 제어된 모드에서 값 변경 알림
      if (isControlled && onValueChange) {
        const currentFiles = Array.from(store.getState().files.values()).map(
          (f) => f.file,
        )
        onValueChange([...currentFiles])
      }

      // 콜백 함수들 실행
      if (onAccept) {
        onAccept(acceptedFiles)
      }

      for (const file of acceptedFiles) {
        onFileAccept?.(file)
      }

      // 업로드 함수가 있다면 업로드 시작
      if (onUpload) {
        requestAnimationFrame(() => {
          onFilesUpload(acceptedFiles)
        })
      }
    }
  }
}
