"use client"

import { Slot } from "radix-ui"
import { type KeyboardEvent, useCallback } from "react"

import {
  ITEM_DELETE_NAME,
  useFileUploadContext,
  useFileUploadItemContext,
  useFileUploadStore,
} from "../hooks"
import type { FileUploadItemDeleteProps } from "../types"

export function FileUploadItemDelete(props: FileUploadItemDeleteProps) {
  const {
    asChild,
    className,
    onClick: onClickProp,
    onKeyDown: onKeyDownProp,
    ...deleteProps
  } = props

  const context = useFileUploadContext(ITEM_DELETE_NAME)
  const itemContext = useFileUploadItemContext(ITEM_DELETE_NAME)
  const store = useFileUploadStore()

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClickProp?.(event)

      if (event.defaultPrevented) return

      event.preventDefault()
      store.removeFile(itemContext.fileState!.file)
    },
    [store, itemContext, onClickProp],
  )

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDownProp?.(event)

      if (
        !event.defaultPrevented &&
        (event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault()
        store.removeFile(itemContext.fileState!.file)
      }
    },
    [store, itemContext, onKeyDownProp],
  )

  const DeletePrimitive = asChild ? Slot.Root : "button"

  return (
    <DeletePrimitive
      type="button"
      aria-label={`Remove ${itemContext.fileState?.file.name ?? "file"}`}
      aria-describedby={itemContext.messageId}
      data-slot="file-upload-item-delete"
      dir={context.dir}
      {...deleteProps}
      className={className}
      onClick={onClick}
      onKeyDown={onKeyDown}
    />
  )
}
