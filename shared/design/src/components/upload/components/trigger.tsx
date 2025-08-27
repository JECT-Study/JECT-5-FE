"use client"

import { Slot } from "radix-ui"
import { type MouseEvent, useCallback } from "react"

import { TRIGGER_NAME, useFileUploadContext } from "../hooks"
import type { FileUploadTriggerProps } from "../types"

export function FileUploadTrigger(props: FileUploadTriggerProps) {
  const { asChild, onClick: onClickProp, ...triggerProps } = props
  const context = useFileUploadContext(TRIGGER_NAME)

  const onClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClickProp?.(event)

      if (event.defaultPrevented) return

      context.inputRef.current?.click()
    },
    [context.inputRef, onClickProp],
  )

  const TriggerPrimitive = asChild ? Slot.Root : "button"

  return (
    <TriggerPrimitive
      type="button"
      aria-controls={context.inputId}
      data-disabled={context.disabled ? "" : undefined}
      data-slot="file-upload-trigger"
      {...triggerProps}
      disabled={context.disabled}
      onClick={onClick}
    />
  )
}
