"use client"

import { Slot } from "radix-ui"
import * as React from "react"

import {
  ITEM_DELETE_NAME,
  useFileUploadItemContext,
  useStoreContext,
} from "../hooks"
import type { FileUploadItemDeleteProps } from "../types"

export function FileUploadItemDelete(props: FileUploadItemDeleteProps) {
  const { asChild, onClick: onClickProp, className, ...deleteProps } = props

  const store = useStoreContext(ITEM_DELETE_NAME)
  const itemContext = useFileUploadItemContext(ITEM_DELETE_NAME)

  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClickProp?.(event)

      if (!itemContext.fileState || event.defaultPrevented) return

      store.dispatch({
        type: "REMOVE_FILE",
        file: itemContext.fileState.file,
      })
    },
    [store, itemContext.fileState, onClickProp],
  )

  if (!itemContext.fileState) return null

  const ItemDeletePrimitive = asChild ? Slot.Root : "button"

  return (
    <ItemDeletePrimitive
      type="button"
      aria-controls={itemContext.id}
      aria-describedby={itemContext.nameId}
      data-slot="file-upload-item-delete"
      {...deleteProps}
      className={className}
      onClick={onClick}
    />
  )
}
