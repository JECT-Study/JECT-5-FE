"use client"

import { Slot } from "radix-ui"

import {
  ITEM_METADATA_NAME,
  useFileUploadContext,
  useFileUploadItemContext,
} from "../hooks"
import type { FileUploadItemMetadataProps } from "../types"
import { formatBytes } from "../utils"

export function FileUploadItemMetadata(props: FileUploadItemMetadataProps) {
  const {
    asChild,
    size = "default",
    children,
    className,
    ...metadataProps
  } = props

  const context = useFileUploadContext(ITEM_METADATA_NAME)
  const itemContext = useFileUploadItemContext(ITEM_METADATA_NAME)

  if (!itemContext.fileState) return null

  const ItemMetadataPrimitive = asChild ? Slot.Root : "div"

  return (
    <ItemMetadataPrimitive
      data-slot="file-upload-metadata"
      dir={context.dir}
      {...metadataProps}
      className={className}
    >
      {children ?? (
        <>
          <span
            id={itemContext.nameId}
            className={
              size === "sm" ? "text-[13px] font-normal leading-snug" : undefined
            }
          >
            {itemContext.fileState.file.name}
          </span>
          <span
            id={itemContext.sizeId}
            className={size === "sm" ? "text-[11px] leading-snug" : undefined}
          >
            {formatBytes(itemContext.fileState.file.size)}
          </span>
          {itemContext.fileState.error && (
            <span id={itemContext.messageId}>
              {itemContext.fileState.error}
            </span>
          )}
        </>
      )}
    </ItemMetadataPrimitive>
  )
}
