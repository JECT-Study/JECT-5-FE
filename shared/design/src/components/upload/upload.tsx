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
import {
  createFilesChangeHandler,
  createFilesUploadHandler,
  createInputChangeHandler,
  createProgressThrottle,
  createTriggerClickHandler,
} from "./core/uploadManager"
import {
  COMPONENT_NAMES,
  type Direction,
  type FileState,
  type FileUploadClearProps,
  type FileUploadContextValue,
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

export const FileUploadContext =
  React.createContext<FileUploadContextValue | null>(null)

export function useFileUploadContext(consumerName: string) {
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
    const throttle = createProgressThrottle()
    return (file: File, progress: number) => {
      throttle(() => {
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
      const handler = createFilesUploadHandler({
        store,
        onUpload,
        onProgress,
      })
      await handler(files)
    },
    [store, onUpload, onProgress],
  )

  const onFilesChange = React.useCallback(
    (originalFiles: File[]) => {
      const handler = createFilesChangeHandler({
        store,
        isControlled,
        onValueChange,
        onAccept,
        onFileAccept,
        onUpload,
        disabled,
        validation: {
          acceptTypes,
          maxSize,
          maxFiles,
          validator: onFileValidate,
          onFileReject,
        },
        onFilesUpload,
      })
      handler(originalFiles)
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
      const handler = createInputChangeHandler(onFilesChange)
      handler(event)
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

function FileUploadTrigger(props: FileUploadTriggerProps) {
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
  FileUploadRoot as FileUpload,
  FileUploadClear,
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
