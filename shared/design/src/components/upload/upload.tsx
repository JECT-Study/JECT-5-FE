"use client"

import { Slot } from "radix-ui"
import * as React from "react"

import {
  createStore,
  StoreContext,
  useLazyRef,
  useStore,
  useStoreContext,
} from "./core/store"
import { validateFiles } from "./core/validation"
import {
  COMPONENT_NAMES,
  type Direction,
  type FileState,
  type FileUploadClearProps,
  type FileUploadContextValue,
  type FileUploadDropzoneProps,
  type FileUploadItemContextValue,
  type FileUploadItemDeleteProps,
  type FileUploadItemMetadataProps,
  type FileUploadItemProgressProps,
  type FileUploadItemProps,
  type FileUploadListProps,
  type FileUploadRootProps,
  type FileUploadTriggerProps,
} from "./types"

const {
  ROOT: ROOT_NAME,
  DROPZONE: DROPZONE_NAME,
  TRIGGER: TRIGGER_NAME,
  LIST: LIST_NAME,
  ITEM: ITEM_NAME,
  ITEM_METADATA: ITEM_METADATA_NAME,
  ITEM_PROGRESS: ITEM_PROGRESS_NAME,
  ITEM_DELETE: ITEM_DELETE_NAME,
  CLEAR: CLEAR_NAME,
} = COMPONENT_NAMES

const DirectionContext = React.createContext<Direction | undefined>(undefined)

function useDirection(dirProp?: Direction): Direction {
  const contextDir = React.useContext(DirectionContext)
  return dirProp ?? contextDir ?? "ltr"
}

const FileUploadContext = React.createContext<FileUploadContextValue | null>(
  null,
)

function useFileUploadContext(consumerName: string) {
  const context = React.useContext(FileUploadContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\``)
  }
  return context
}

function FileUploadRoot(props: FileUploadRootProps) {
  const {
    value,
    defaultValue,
    onValueChange,
    onAccept,
    onFileAccept,
    onFileReject,
    onFileValidate,
    onUpload,
    accept,
    maxFiles,
    maxSize,
    dir: dirProp,
    label,
    name,
    asChild,
    disabled = false,
    invalid = false,
    multiple = false,
    required = false,
    children,
    className,
    ...rootProps
  } = props

  const inputId = React.useId()
  const dropzoneId = React.useId()
  const listId = React.useId()
  const labelId = React.useId()

  const dir = useDirection(dirProp)
  const listeners = useLazyRef(() => new Set<() => void>()).current
  const files = useLazyRef<Map<File, FileState>>(() => new Map()).current
  const urlCache = useLazyRef(() => new WeakMap<File, string>()).current
  const inputRef = React.useRef<HTMLInputElement>(null)
  const isControlled = value !== undefined

  const store = React.useMemo(
    () => createStore(listeners, files, urlCache, invalid, onValueChange),
    [listeners, files, invalid, onValueChange, urlCache],
  )

  const acceptTypes = React.useMemo(
    () => accept?.split(",").map((t) => t.trim()) ?? null,
    [accept],
  )

  const onProgress = useLazyRef(() => {
    let frame = 0
    return (file: File, progress: number) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        store.dispatch({
          type: "SET_PROGRESS",
          file,
          progress: Math.min(Math.max(0, progress), 100),
        })
      })
    }
  }).current

  React.useEffect(() => {
    if (isControlled) {
      store.dispatch({ type: "SET_FILES", files: value })
    } else if (
      defaultValue &&
      defaultValue.length > 0 &&
      !store.getState().files.size
    ) {
      store.dispatch({ type: "SET_FILES", files: defaultValue })
    }
  }, [value, defaultValue, isControlled, store])

  React.useEffect(() => {
    return () => {
      for (const file of Array.from(files?.keys() ?? [])) {
        const cachedUrl = urlCache?.get(file)
        if (cachedUrl) {
          URL.revokeObjectURL(cachedUrl)
        }
      }
    }
  }, [files, urlCache])

  const onFilesUpload = React.useCallback(
    async (files: File[]) => {
      try {
        for (const file of files) {
          store.dispatch({ type: "SET_PROGRESS", file, progress: 0 })
        }

        if (onUpload) {
          await onUpload(files, {
            onProgress,
            onSuccess: (file) => {
              store.dispatch({ type: "SET_SUCCESS", file })
            },
            onError: (file, error) => {
              store.dispatch({
                type: "SET_ERROR",
                file,
                error: error.message ?? "Upload failed",
              })
            },
          })
        } else {
          for (const file of files) {
            store.dispatch({ type: "SET_SUCCESS", file })
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed"
        for (const file of files) {
          store.dispatch({
            type: "SET_ERROR",
            file,
            error: errorMessage,
          })
        }
      }
    },
    [store, onUpload, onProgress],
  )

  const onFilesChange = React.useCallback(
    (originalFiles: File[]) => {
      if (disabled) return

      // 현재 파일 개수 조회
      const currentFileCount = store.getState().files.size

      // 파일 검증 실행
      const validationResult = validateFiles(originalFiles, {
        acceptTypes,
        maxSize,
        maxFiles,
        currentFileCount,
        validator: onFileValidate,
        onFileReject,
      })

      const { acceptedFiles, hasInvalid } = validationResult

      // 검증 실패 시 invalid 상태 설정 (2초 후 자동 해제)
      if (hasInvalid) {
        store.dispatch({ type: "SET_INVALID", invalid: true })
        setTimeout(() => {
          store.dispatch({ type: "SET_INVALID", invalid: false })
        }, 2000)
      }

      // 수락된 파일들 처리
      if (acceptedFiles.length > 0) {
        store.dispatch({ type: "ADD_FILES", files: acceptedFiles })

        // 제어된 모드에서 값 변경 알림
        if (isControlled && onValueChange) {
          const currentFiles = Array.from(store.getState().files.values()).map(
            (f) => f.file,
          )
          onValueChange([...currentFiles])
        }

        // 콜백 함수들 실행
        if (onAccept) {
          onAccept(acceptedFiles)
        }

        for (const file of acceptedFiles) {
          onFileAccept?.(file)
        }

        // 업로드 함수가 있다면 업로드 시작
        if (onUpload) {
          requestAnimationFrame(() => {
            onFilesUpload(acceptedFiles)
          })
        }
      }
    },
    [
      store,
      isControlled,
      onValueChange,
      onAccept,
      onFileAccept,
      onUpload,
      disabled,
      acceptTypes,
      maxSize,
      maxFiles,
      onFileValidate,
      onFileReject,
      onFilesUpload,
    ],
  )

  const onInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? [])
      onFilesChange(files)
      event.target.value = ""
    },
    [onFilesChange],
  )

  const contextValue = React.useMemo<FileUploadContextValue>(
    () => ({
      dropzoneId,
      inputId,
      listId,
      labelId,
      dir,
      disabled,
      inputRef,
      urlCache,
    }),
    [dropzoneId, inputId, listId, labelId, dir, disabled, urlCache],
  )

  const RootPrimitive = asChild ? Slot.Root : "div"

  return (
    <StoreContext.Provider value={store}>
      <FileUploadContext.Provider value={contextValue}>
        <RootPrimitive
          data-disabled={disabled ? "" : undefined}
          data-slot="file-upload"
          dir={dir}
          {...rootProps}
          className={className}
        >
          {children}
          <input
            type="file"
            id={inputId}
            aria-labelledby={labelId}
            aria-describedby={dropzoneId}
            ref={inputRef}
            tabIndex={-1}
            accept={accept}
            name={name}
            className="sr-only"
            disabled={disabled}
            multiple={multiple}
            required={required}
            onChange={onInputChange}
            style={{ display: "none" }}
          />
          <span id={labelId} className="sr-only">
            {label ?? "File upload"}
          </span>
        </RootPrimitive>
      </FileUploadContext.Provider>
    </StoreContext.Provider>
  )
}

function FileUploadDropzone(props: FileUploadDropzoneProps) {
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

  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      onClickProp?.(event)

      if (event.defaultPrevented) return

      const target = event.target

      const isFromTrigger =
        target instanceof HTMLElement &&
        target.closest('[data-slot="file-upload-trigger"]')

      if (!isFromTrigger) {
        context.inputRef.current?.click()
      }
    },
    [context.inputRef, onClickProp],
  )

  const onDragOver = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      onDragOverProp?.(event)

      if (event.defaultPrevented) return

      event.preventDefault()
      store.dispatch({ type: "SET_DRAG_OVER", dragOver: true })
    },
    [store, onDragOverProp],
  )

  const onDragEnter = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      onDragEnterProp?.(event)

      if (event.defaultPrevented) return

      event.preventDefault()
      store.dispatch({ type: "SET_DRAG_OVER", dragOver: true })
    },
    [store, onDragEnterProp],
  )

  const onDragLeave = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      onDragLeaveProp?.(event)

      if (event.defaultPrevented) return

      const relatedTarget = event.relatedTarget
      if (
        relatedTarget &&
        relatedTarget instanceof Node &&
        event.currentTarget.contains(relatedTarget)
      ) {
        return
      }

      event.preventDefault()
      store.dispatch({ type: "SET_DRAG_OVER", dragOver: false })
    },
    [store, onDragLeaveProp],
  )

  const onDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      onDropProp?.(event)

      if (event.defaultPrevented) return

      event.preventDefault()
      store.dispatch({ type: "SET_DRAG_OVER", dragOver: false })

      const files = Array.from(event.dataTransfer.files)
      const inputElement = context.inputRef.current
      if (!inputElement) return

      const dataTransfer = new DataTransfer()
      for (const file of files) {
        dataTransfer.items.add(file)
      }

      inputElement.files = dataTransfer.files
      inputElement.dispatchEvent(new Event("change", { bubbles: true }))
    },
    [store, context.inputRef, onDropProp],
  )

  const onPaste = React.useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      onPasteProp?.(event)

      if (event.defaultPrevented) return

      event.preventDefault()
      store.dispatch({ type: "SET_DRAG_OVER", dragOver: false })

      const items = event.clipboardData?.items
      if (!items) return

      const files: File[] = []
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item?.kind === "file") {
          const file = item.getAsFile()
          if (file) {
            files.push(file)
          }
        }
      }

      if (files.length === 0) return

      const inputElement = context.inputRef.current
      if (!inputElement) return

      const dataTransfer = new DataTransfer()
      for (const file of files) {
        dataTransfer.items.add(file)
      }

      inputElement.files = dataTransfer.files
      inputElement.dispatchEvent(new Event("change", { bubbles: true }))
    },
    [store, context.inputRef, onPasteProp],
  )

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDownProp?.(event)

      if (
        !event.defaultPrevented &&
        (event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault()
        context.inputRef.current?.click()
      }
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
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
    />
  )
}

function FileUploadTrigger(props: FileUploadTriggerProps) {
  const { asChild, onClick: onClickProp, ...triggerProps } = props
  const context = useFileUploadContext(TRIGGER_NAME)

  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
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

function FileUploadList(props: FileUploadListProps) {
  const {
    className,
    orientation = "vertical",
    asChild,
    forceMount,
    ...listProps
  } = props

  const context = useFileUploadContext(LIST_NAME)
  const fileCount = useStore((state) => state.files.size)
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

const FileUploadItemContext =
  React.createContext<FileUploadItemContextValue | null>(null)

function useFileUploadItemContext(consumerName: string) {
  const context = React.useContext(FileUploadItemContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ITEM_NAME}\``)
  }
  return context
}

function FileUploadItem(props: FileUploadItemProps) {
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

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B"
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(i ? 1 : 0)} ${sizes[i]}`
}

// interface FileUploadItemPreviewProps
//   extends React.ComponentPropsWithoutRef<"div"> {
//   render?: (file: File) => React.ReactNode
//   asChild?: boolean
// }

// function FileUploadItemPreview(props: FileUploadItemPreviewProps) {
//   const { render, asChild, children, className, ...previewProps } = props

//   const itemContext = useFileUploadItemContext(ITEM_PREVIEW_NAME)
//   const context = useFileUploadContext(ITEM_PREVIEW_NAME)

//   const onPreviewRender = React.useCallback(
//     (file: File) => {
//       if (render) return render(file)

//       if (itemContext.fileState?.file.type.startsWith("image/")) {
//         let url = context.urlCache.get(file)
//         if (!url) {
//           url = URL.createObjectURL(file)
//           context.urlCache.set(file, url)
//         }

//         return (
//           <img src={url} alt={file.name} className="size-full object-cover" />
//         )
//       }

//       return getFileIcon(file)
//     },
//     [render, itemContext.fileState?.file.type, context.urlCache],
//   )

//   if (!itemContext.fileState) return null

//   const ItemPreviewPrimitive = asChild ? Slot.Root : "div"

//   return (
//     <ItemPreviewPrimitive
//       aria-labelledby={itemContext.nameId}
//       data-slot="file-upload-preview"
//       {...previewProps}
//       className={className}
//     >
//       {onPreviewRender(itemContext.fileState.file)}
//       {children}
//     </ItemPreviewPrimitive>
//   )
// }

function FileUploadItemMetadata(props: FileUploadItemMetadataProps) {
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

function FileUploadItemProgress(props: FileUploadItemProgressProps) {
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

function FileUploadItemDelete(props: FileUploadItemDeleteProps) {
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

function FileUploadClear(props: FileUploadClearProps) {
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

export {
  FileUploadClear as Clear,
  FileUploadDropzone as Dropzone,
  FileUploadRoot as FileUpload,
  FileUploadClear,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemProgress,
  FileUploadList,
  //
  FileUploadTrigger,
  FileUploadItem as Item,
  FileUploadItemDelete as ItemDelete,
  FileUploadItemMetadata as ItemMetadata,
  FileUploadItemProgress as ItemProgress,
  FileUploadList as List,
  //
  FileUploadRoot as Root,
  FileUploadTrigger as Trigger,
  //
  useStore as useFileUpload,
}
