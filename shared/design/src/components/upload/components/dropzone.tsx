"use client"

import { Slot } from "radix-ui"
import * as React from "react"

import {
  createClickHandler,
  createDragHandlers,
  createKeyboardHandler,
} from "../core/dragAndDrop"
import { useStore, useStoreContext } from "../core/store"
import { COMPONENT_NAMES, type FileUploadDropzoneProps } from "../types"
import { useFileUploadContext } from "../upload"

const { DROPZONE: DROPZONE_NAME } = COMPONENT_NAMES

/**
 * 파일 업로드 드롭존 컴포넌트
 *
 * 드래그 앤 드롭, 클릭, 키보드 상호작용을 지원하는 파일 업로드 영역
 */
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

  // 드래그 앤 드롭 핸들러들 생성
  const dragHandlers = React.useMemo(
    () =>
      createDragHandlers({
        store,
        inputRef: context.inputRef,
        existingHandlers: {
          onDragOver: onDragOverProp,
          onDragEnter: onDragEnterProp,
          onDragLeave: onDragLeaveProp,
          onDrop: onDropProp,
          onPaste: onPasteProp,
        },
      }),
    [
      store,
      context.inputRef,
      onDragOverProp,
      onDragEnterProp,
      onDragLeaveProp,
      onDropProp,
      onPasteProp,
    ],
  )

  // 클릭 핸들러 생성
  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const handler = createClickHandler(context.inputRef, onClickProp)
      handler(event)
    },
    [context.inputRef, onClickProp],
  )

  // 키보드 핸들러 생성
  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const handler = createKeyboardHandler(context.inputRef, onKeyDownProp)
      handler(event)
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
      onDragEnter={dragHandlers.onDragEnter}
      onDragLeave={dragHandlers.onDragLeave}
      onDragOver={dragHandlers.onDragOver}
      onDrop={dragHandlers.onDrop}
      onKeyDown={onKeyDown}
      onPaste={dragHandlers.onPaste}
    />
  )
}
