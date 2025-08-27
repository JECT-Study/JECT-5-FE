"use client"

import { Slot } from "radix-ui"
import {
  type ClipboardEvent,
  type DragEvent,
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
} from "react"

import {
  DROPZONE_NAME,
  useFileUploadContext,
  useFileUploadStore,
} from "../hooks"
import type { FileUploadDropzoneProps } from "../types"

export function FileUploadDropzone(props: FileUploadDropzoneProps) {
  const {
    asChild,
    className,
    onClick: onClickProp,
    onDragOver: onDragOverProp,
    onDragEnter: onDragEnterProp,
    onDragLeave: onDragLeaveProp,
    onDrop: onDropProp,
    onPaste: onPasteProp,
    onKeyDown: onKeyDownProp,
    ...dropzoneProps
  } = props

  const context = useFileUploadContext(DROPZONE_NAME)
  const store = useFileUploadStore()
  const dragOver = store.state.dragOver
  const invalid = store.state.invalid

  const onClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      onClickProp?.(event)

      if (event.defaultPrevented) return

      const target = event.target

      const isFromTrigger =
        target instanceof HTMLElement &&
        target.closest('[data-slot="file-upload-trigger"]')

      if (!isFromTrigger) {
        context.inputRef.current?.click()
      }
    },
    [context.inputRef, onClickProp],
  )

  const onDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      onDragOverProp?.(event)

      if (event.defaultPrevented) return

      event.preventDefault()
      store.setDragOver(true)
    },
    [store, onDragOverProp],
  )

  const onDragEnter = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      onDragEnterProp?.(event)

      if (event.defaultPrevented) return

      event.preventDefault()
      store.setDragOver(true)
    },
    [store, onDragEnterProp],
  )

  const onDragLeave = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
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
      store.setDragOver(false)
    },
    [store, onDragLeaveProp],
  )

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      onDropProp?.(event)

      if (event.defaultPrevented) return

      event.preventDefault()
      store.setDragOver(false)

      const files = Array.from(event.dataTransfer.files)
      const inputElement = context.inputRef.current
      if (!inputElement) return

      const dataTransfer = new DataTransfer()
      for (const file of files) {
        dataTransfer.items.add(file)
      }

      inputElement.files = dataTransfer.files
      inputElement.dispatchEvent(new Event("change", { bubbles: true }))
    },
    [store, context.inputRef, onDropProp],
  )

  const onPaste = useCallback(
    (event: ClipboardEvent<HTMLDivElement>) => {
      onPasteProp?.(event)

      if (event.defaultPrevented) return

      event.preventDefault()
      store.setDragOver(false)

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

      const inputElement = context.inputRef.current
      if (!inputElement) return

      const dataTransfer = new DataTransfer()
      for (const file of files) {
        dataTransfer.items.add(file)
      }

      inputElement.files = dataTransfer.files
      inputElement.dispatchEvent(new Event("change", { bubbles: true }))
    },
    [store, context.inputRef, onPasteProp],
  )

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDownProp?.(event)

      if (
        !event.defaultPrevented &&
        (event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault()
        context.inputRef.current?.click()
      }
    },
    [context.inputRef, onKeyDownProp],
  )

  const DropzonePrimitive = asChild ? Slot.Root : "div"

  return (
    <DropzonePrimitive
      role="region"
      aria-label="파일 드래그 앤 드롭 영역"
      id={context.dropzoneId}
      aria-controls={`${context.inputId} ${context.listId}`}
      aria-disabled={context.disabled}
      aria-invalid={invalid}
      data-disabled={context.disabled ? "" : undefined}
      data-dragging={dragOver ? "" : undefined}
      data-invalid={invalid ? "" : undefined}
      data-slot="file-upload-dropzone"
      dir={context.dir}
      tabIndex={context.disabled ? undefined : 0}
      {...dropzoneProps}
      className={className}
      onClick={onClick}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
    />
  )
}
