"use client"

import { Slot } from "radix-ui"
import * as React from "react"

import {
  DROPZONE_NAME,
  useFileUploadContext,
  useStore,
  useStoreContext,
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
  const store = useStoreContext(DROPZONE_NAME)
  const dragOver = useStore((state) => state.dragOver)
  const invalid = useStore((state) => state.invalid)

  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
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

  const onDragOver = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      onDragOverProp?.(event)

      if (event.defaultPrevented) return

      event.preventDefault()
      store.dispatch({ type: "SET_DRAG_OVER", dragOver: true })
    },
    [store, onDragOverProp],
  )

  const onDragEnter = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      onDragEnterProp?.(event)

      if (event.defaultPrevented) return

      event.preventDefault()
      store.dispatch({ type: "SET_DRAG_OVER", dragOver: true })
    },
    [store, onDragEnterProp],
  )

  const onDragLeave = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
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
    },
    [store, onDragLeaveProp],
  )

  const onDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      onDropProp?.(event)

      if (event.defaultPrevented) return

      event.preventDefault()
      store.dispatch({ type: "SET_DRAG_OVER", dragOver: false })

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

  const onPaste = React.useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
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

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
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
