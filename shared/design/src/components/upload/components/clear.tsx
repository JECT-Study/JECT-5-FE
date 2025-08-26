"use client"

import { Slot } from "radix-ui"
import * as React from "react"

import {
  CLEAR_NAME,
  useFileUploadContext,
  useStore,
  useStoreContext,
} from "../hooks"
import type { FileUploadClearProps } from "../types"

export function FileUploadClear(props: FileUploadClearProps) {
  const {
    asChild,
    forceMount,
    disabled,
    onClick: onClickProp,
    className,
    ...clearProps
  } = props

  const context = useFileUploadContext(CLEAR_NAME)
  const store = useStoreContext(CLEAR_NAME)
  const fileCount = useStore((state) => state.files.size)

  const isDisabled = disabled || context.disabled

  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClickProp?.(event)

      if (event.defaultPrevented) return

      store.dispatch({ type: "CLEAR" })
    },
    [store, onClickProp],
  )

  const shouldRender = forceMount || fileCount > 0

  if (!shouldRender) return null

  const ClearPrimitive = asChild ? Slot.Root : "button"

  return (
    <ClearPrimitive
      type="button"
      aria-controls={context.listId}
      data-slot="file-upload-clear"
      data-disabled={isDisabled ? "" : undefined}
      {...clearProps}
      className={className}
      disabled={isDisabled}
      onClick={onClick}
    />
  )
}
