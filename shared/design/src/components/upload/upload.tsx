"use client"

import { Slot } from "radix-ui"
import * as React from "react"

import { createStore, StoreContext, useLazyRef, useStore } from "./core/store"
import {
  createFilesChangeHandler,
  createFilesUploadHandler,
  createInputChangeHandler,
  createProgressThrottle,
} from "./core/uploadManager"
import {
  COMPONENT_NAMES,
  type Direction,
  type FileState,
  type FileUploadContextValue,
  type FileUploadRootProps,
} from "./types"

const { ROOT: ROOT_NAME } = COMPONENT_NAMES

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

export { FileUploadRoot as FileUpload, useStore as useFileUpload }
