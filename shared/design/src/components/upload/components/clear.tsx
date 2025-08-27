"use client"

import { Slot } from "radix-ui"
import { type KeyboardEvent, type MouseEvent, useCallback } from "react"

import { CLEAR_NAME, useFileUploadContext, useFileUploadStore } from "../hooks"
import type { FileUploadClearProps } from "../types"

export function FileUploadClear(props: FileUploadClearProps) {
  const {
    asChild,
    className,
    onClick: onClickProp,
    onKeyDown: onKeyDownProp,
    ...clearProps
  } = props

  const context = useFileUploadContext(CLEAR_NAME)
  const store = useFileUploadStore()
  const fileCount = store.state.files.size
  const shouldRender = fileCount > 0

  const onClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClickProp?.(event)

      if (event.defaultPrevented) return

      event.preventDefault()
      store.clear()
    },
    [store, onClickProp],
  )

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDownProp?.(event)

      if (
        !event.defaultPrevented &&
        (event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault()
        store.clear()
      }
    },
    [store, onKeyDownProp],
  )

  if (!shouldRender) return null

  const ClearPrimitive = asChild ? Slot.Root : "button"
  const clearLabel = `전체 파일 ${fileCount}개 삭제`

  return (
    <ClearPrimitive
      type="button"
      aria-label={clearLabel}
      data-slot="file-upload-clear"
      dir={context.dir}
      {...clearProps}
      className={className}
      onClick={onClick}
      onKeyDown={onKeyDown}
    />
  )
}
