"use client"

import { Slot } from "radix-ui"
import { useId, useMemo } from "react"

import {
  FileUploadItemContext,
  ITEM_NAME,
  useFileUploadContext,
  useFileUploadStore,
} from "../hooks"
import type { FileUploadItemProps } from "../types"

export function FileUploadItem(props: FileUploadItemProps) {
  const { value, asChild, className, ...itemProps } = props

  const id = useId()
  const statusId = `${id}-status`
  const nameId = `${id}-name`
  const sizeId = `${id}-size`
  const messageId = `${id}-message`

  const context = useFileUploadContext(ITEM_NAME)
  const store = useFileUploadStore()
  const fileState = store.state.files.get(value)
  const fileCount = store.state.files.size
  const fileIndex = useMemo(() => {
    const files = Array.from(store.state.files.keys())
    return files.indexOf(value) + 1
  }, [store.state.files, value])

  const itemContext = useMemo(
    () => ({
      id,
      fileState,
      nameId,
      sizeId,
      statusId,
      messageId,
    }),
    [id, fileState, statusId, nameId, sizeId, messageId],
  )

  if (!fileState) return null

  const statusText = fileState.error
    ? `Error: ${fileState.error}`
    : fileState.status === "uploading"
      ? `Uploading: ${fileState.progress}% complete`
      : fileState.status === "success"
        ? "Upload complete"
        : "Ready to upload"

  const ItemPrimitive = asChild ? Slot.Root : "div"

  return (
    <FileUploadItemContext.Provider value={itemContext}>
      <ItemPrimitive
        role="listitem"
        id={id}
        aria-setsize={fileCount}
        aria-posinset={fileIndex}
        aria-describedby={`${nameId} ${sizeId} ${statusId} ${fileState.error ? messageId : ""}`}
        aria-labelledby={nameId}
        data-slot="file-upload-item"
        dir={context.dir}
        {...itemProps}
        className={className}
      >
        {props.children}
        <span id={statusId} className="sr-only">
          {statusText}
        </span>
      </ItemPrimitive>
    </FileUploadItemContext.Provider>
  )
}
