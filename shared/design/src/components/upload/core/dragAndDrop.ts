import * as React from "react"

import { type FileUploadStore } from "../types"

/**
 * 드래그 앤 드롭 핸들러 옵션
 */
export interface DragHandlerOptions {
  /** 파일 업로드 스토어 */
  store: FileUploadStore
  /** input element ref */
  inputRef: React.RefObject<HTMLInputElement>
  /** 기존 핸들러들 */
  existingHandlers?: {
    onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void
    onDragEnter?: (event: React.DragEvent<HTMLDivElement>) => void
    onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void
    onDrop?: (event: React.DragEvent<HTMLDivElement>) => void
    onPaste?: (event: React.ClipboardEvent<HTMLDivElement>) => void
  }
}

/**
 * 클릭 핸들러 생성
 */
export function createClickHandler(
  inputRef: React.RefObject<HTMLInputElement>,
  onClickProp?: (event: React.MouseEvent<HTMLDivElement>) => void,
) {
  return (event: React.MouseEvent<HTMLDivElement>) => {
    onClickProp?.(event)

    if (event.defaultPrevented) return

    const target = event.target

    const isFromTrigger =
      target instanceof HTMLElement &&
      target.closest('[data-slot="file-upload-trigger"]')

    if (!isFromTrigger) {
      inputRef.current?.click()
    }
  }
}

/**
 * 키보드 핸들러 생성
 */
export function createKeyboardHandler(
  inputRef: React.RefObject<HTMLInputElement>,
  onKeyDownProp?: (event: React.KeyboardEvent<HTMLDivElement>) => void,
) {
  return (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDownProp?.(event)

    if (
      !event.defaultPrevented &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault()
      inputRef.current?.click()
    }
  }
}

/**
 * 드래그 오버 핸들러 생성
 */
export function createDragOverHandler(
  store: FileUploadStore,
  onDragOverProp?: (event: React.DragEvent<HTMLDivElement>) => void,
) {
  return (event: React.DragEvent<HTMLDivElement>) => {
    onDragOverProp?.(event)

    if (event.defaultPrevented) return

    event.preventDefault()
    store.dispatch({ type: "SET_DRAG_OVER", dragOver: true })
  }
}

/**
 * 드래그 엔터 핸들러 생성
 */
export function createDragEnterHandler(
  store: FileUploadStore,
  onDragEnterProp?: (event: React.DragEvent<HTMLDivElement>) => void,
) {
  return (event: React.DragEvent<HTMLDivElement>) => {
    onDragEnterProp?.(event)

    if (event.defaultPrevented) return

    event.preventDefault()
    store.dispatch({ type: "SET_DRAG_OVER", dragOver: true })
  }
}

/**
 * 드래그 리브 핸들러 생성
 */
export function createDragLeaveHandler(
  store: FileUploadStore,
  onDragLeaveProp?: (event: React.DragEvent<HTMLDivElement>) => void,
) {
  return (event: React.DragEvent<HTMLDivElement>) => {
    onDragLeaveProp?.(event)

    if (event.defaultPrevented) return

    const relatedTarget = event.relatedTarget
    if (
      relatedTarget &&
      relatedTarget instanceof Node &&
      event.currentTarget.contains(relatedTarget)
    ) {
      return
    }

    event.preventDefault()
    store.dispatch({ type: "SET_DRAG_OVER", dragOver: false })
  }
}

/**
 * 파일을 input element에 설정하고 change 이벤트를 발생시키는 헬퍼 함수
 */
function setFilesToInput(
  files: File[],
  inputRef: React.RefObject<HTMLInputElement>,
) {
  const inputElement = inputRef.current
  if (!inputElement) return

  const dataTransfer = new DataTransfer()
  for (const file of files) {
    dataTransfer.items.add(file)
  }

  inputElement.files = dataTransfer.files
  inputElement.dispatchEvent(new Event("change", { bubbles: true }))
}

/**
 * 드롭 핸들러 생성
 */
export function createDropHandler(
  store: FileUploadStore,
  inputRef: React.RefObject<HTMLInputElement>,
  onDropProp?: (event: React.DragEvent<HTMLDivElement>) => void,
) {
  return (event: React.DragEvent<HTMLDivElement>) => {
    onDropProp?.(event)

    if (event.defaultPrevented) return

    event.preventDefault()
    store.dispatch({ type: "SET_DRAG_OVER", dragOver: false })

    const files = Array.from(event.dataTransfer.files)
    setFilesToInput(files, inputRef)
  }
}

/**
 * 페이스트 핸들러 생성
 */
export function createPasteHandler(
  store: FileUploadStore,
  inputRef: React.RefObject<HTMLInputElement>,
  onPasteProp?: (event: React.ClipboardEvent<HTMLDivElement>) => void,
) {
  return (event: React.ClipboardEvent<HTMLDivElement>) => {
    onPasteProp?.(event)

    if (event.defaultPrevented) return

    event.preventDefault()
    store.dispatch({ type: "SET_DRAG_OVER", dragOver: false })

    const items = event.clipboardData?.items
    if (!items) return

    const files: File[] = []
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item?.kind === "file") {
        const file = item.getAsFile()
        if (file) {
          files.push(file)
        }
      }
    }

    if (files.length === 0) return

    setFilesToInput(files, inputRef)
  }
}

/**
 * 드래그 앤 드롭 관련 모든 핸들러를 생성하는 팩토리 함수
 */
export function createDragHandlers(options: DragHandlerOptions) {
  const { store, inputRef, existingHandlers = {} } = options

  return {
    onDragOver: createDragOverHandler(store, existingHandlers.onDragOver),
    onDragEnter: createDragEnterHandler(store, existingHandlers.onDragEnter),
    onDragLeave: createDragLeaveHandler(store, existingHandlers.onDragLeave),
    onDrop: createDropHandler(store, inputRef, existingHandlers.onDrop),
    onPaste: createPasteHandler(store, inputRef, existingHandlers.onPaste),
  }
}
