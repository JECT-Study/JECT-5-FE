"use client"

import { Slot } from "radix-ui"

import { LIST_NAME, useFileUploadContext, useFileUploadStore } from "../hooks"
import type { FileUploadListProps } from "../types"

export function FileUploadList(props: FileUploadListProps) {
  const {
    className,
    orientation = "vertical",
    asChild,
    forceMount,
    ...listProps
  } = props

  const context = useFileUploadContext(LIST_NAME)
  const store = useFileUploadStore()
  const fileCount = store.state.files.size
  const shouldRender = forceMount || fileCount > 0

  if (!shouldRender) return null

  const ListPrimitive = asChild ? Slot.Root : "div"

  return (
    <ListPrimitive
      role="list"
      id={context.listId}
      aria-orientation={orientation}
      data-orientation={orientation}
      data-slot="file-upload-list"
      data-state={shouldRender ? "active" : "inactive"}
      dir={context.dir}
      {...listProps}
      className={className}
    />
  )
}
