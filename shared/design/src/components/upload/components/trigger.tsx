"use client"

import { Slot } from "radix-ui"
import * as React from "react"

import { createTriggerClickHandler } from "../core/uploadManager"
import { COMPONENT_NAMES, type FileUploadTriggerProps } from "../types"
import { useFileUploadContext } from "../upload"

const { TRIGGER: TRIGGER_NAME } = COMPONENT_NAMES

/**
 * 파일 선택 트리거 버튼 컴포넌트
 *
 * 파일 선택 다이얼로그를 여는 버튼
 */
export function FileUploadTrigger(props: FileUploadTriggerProps) {
  const { asChild, onClick: onClickProp, ...triggerProps } = props
  const context = useFileUploadContext(TRIGGER_NAME)

  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const handler = createTriggerClickHandler(context.inputRef, onClickProp)
      handler(event)
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
