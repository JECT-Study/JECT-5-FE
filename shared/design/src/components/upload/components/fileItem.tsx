"use client"

import { Slot } from "radix-ui"
import * as React from "react"

import { useStore, useStoreContext } from "../core/store"
import {
  COMPONENT_NAMES,
  type FileUploadClearProps,
  type FileUploadItemContextValue,
  type FileUploadItemDeleteProps,
  type FileUploadItemMetadataProps,
  type FileUploadItemProgressProps,
  type FileUploadItemProps,
} from "../types"
import { useFileUploadContext } from "../upload"

const {
  ITEM: ITEM_NAME,
  ITEM_METADATA: ITEM_METADATA_NAME,
  ITEM_PROGRESS: ITEM_PROGRESS_NAME,
  ITEM_DELETE: ITEM_DELETE_NAME,
  CLEAR: CLEAR_NAME,
} = COMPONENT_NAMES

// FileUploadItem 전용 Context
const FileUploadItemContext =
  React.createContext<FileUploadItemContextValue | null>(null)

function useFileUploadItemContext(consumerName: string) {
  const context = React.useContext(FileUploadItemContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ITEM_NAME}\``)
  }
  return context
}

/**
 * 파일 크기를 사람이 읽기 쉬운 형태로 포맷팅
 */
function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B"
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(i ? 1 : 0)} ${sizes[i]}`
}

/**
 * 개별 파일 아이템 컴포넌트
 *
 * 업로드된 파일을 표시하는 기본 컨테이너
 */
export function FileUploadItem(props: FileUploadItemProps) {
  const { value, asChild, className, ...itemProps } = props

  const id = React.useId()
  const statusId = `${id}-status`
  const nameId = `${id}-name`
  const sizeId = `${id}-size`
  const messageId = `${id}-message`

  const context = useFileUploadContext(ITEM_NAME)
  const fileState = useStore((state) => state.files.get(value))
  const fileCount = useStore((state) => state.files.size)
  const fileIndex = useStore((state) => {
    const files = Array.from(state.files.keys())
    return files.indexOf(value) + 1
  })

  const itemContext = React.useMemo(
    () => ({
      id,
      fileState: fileState ?? null,
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

/**
 * 파일 메타데이터 컴포넌트
 *
 * 파일명, 크기, 에러 메시지 등을 표시
 */
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

/**
 * 파일 업로드 진행률 컴포넌트
 *
 * 선형, 원형, 채우기 스타일의 진행률 표시 지원
 */
export function FileUploadItemProgress(props: FileUploadItemProgressProps) {
  const {
    variant = "linear",
    size = 40,
    asChild,
    forceMount,
    className,
    ...progressProps
  } = props

  const itemContext = useFileUploadItemContext(ITEM_PROGRESS_NAME)

  if (!itemContext.fileState) return null

  const shouldRender = forceMount || itemContext.fileState.progress !== 100

  if (!shouldRender) return null

  const ItemProgressPrimitive = asChild ? Slot.Root : "div"

  switch (variant) {
    case "circular": {
      const circumference = 2 * Math.PI * ((size - 4) / 2)
      const strokeDashoffset =
        circumference - (itemContext.fileState.progress / 100) * circumference

      return (
        <ItemProgressPrimitive
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={itemContext.fileState.progress}
          aria-valuetext={`${itemContext.fileState.progress}%`}
          aria-labelledby={itemContext.nameId}
          data-slot="file-upload-progress"
          {...progressProps}
          className={className}
        >
          <svg
            className="-rotate-90"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            fill="none"
            stroke="currentColor"
          >
            <circle
              strokeWidth="2"
              cx={size / 2}
              cy={size / 2}
              r={(size - 4) / 2}
            />
            <circle
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              cx={size / 2}
              cy={size / 2}
              r={(size - 4) / 2}
            />
          </svg>
        </ItemProgressPrimitive>
      )
    }
    case "fill": {
      const progressPercentage = itemContext.fileState.progress
      const topInset = 100 - progressPercentage

      return (
        <ItemProgressPrimitive
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercentage}
          aria-valuetext={`${progressPercentage}%`}
          aria-labelledby={itemContext.nameId}
          data-slot="file-upload-progress"
          {...progressProps}
          className={className}
          style={{
            clipPath: `inset(${topInset}% 0% 0% 0%)`,
            ...progressProps.style,
          }}
        />
      )
    }
    default:
      return (
        <ItemProgressPrimitive
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={itemContext.fileState.progress}
          aria-valuetext={`${itemContext.fileState.progress}%`}
          aria-labelledby={itemContext.nameId}
          data-slot="file-upload-progress"
          {...progressProps}
          className={className}
        >
          <div
            style={{
              transform: `translateX(-${100 - itemContext.fileState.progress}%)`,
              ...progressProps.style,
            }}
          />
        </ItemProgressPrimitive>
      )
  }
}

/**
 * 개별 파일 삭제 버튼 컴포넌트
 *
 * 특정 파일을 목록에서 제거하는 버튼
 */
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

/**
 * 전체 파일 목록 삭제 버튼 컴포넌트
 *
 * 모든 파일을 한 번에 제거하는 버튼
 */
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
