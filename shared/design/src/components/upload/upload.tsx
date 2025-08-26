"use client"

import { Slot } from "radix-ui"
import * as React from "react"

import {
  FileUploadClear,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
} from "./components"
import {
  createStore,
  FileUploadContext,
  StoreContext,
  useDirection,
} from "./hooks"
import type { FileState, FileUploadRootProps } from "./types"
import { useLazyRef, validateFiles } from "./utils"

function FileUploadRoot(props: FileUploadRootProps) {
  const {
    value,
    defaultValue,
    onChange,
    onUpload,
    accept,
    maxFiles,
    maxSize,
    dir: dirProp,
    label,
    name,
    asChild,
    disabled = false,
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
    () => createStore(listeners, files, urlCache, false, onChange),
    [listeners, files, onChange, urlCache],
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

      const currentFileCount = store.getState().files.size
      const { validFiles, invalidFiles } = validateFiles(originalFiles, {
        accept,
        maxFiles,
        maxSize,
        currentFileCount,
      })

      if (invalidFiles.length > 0) {
        store.dispatch({ type: "SET_INVALID", invalid: true })
        setTimeout(() => {
          store.dispatch({ type: "SET_INVALID", invalid: false })
        }, 2000)
      }

      if (validFiles.length > 0) {
        store.dispatch({ type: "ADD_FILES", files: validFiles })

        if (isControlled && onChange) {
          const currentFiles = Array.from(store.getState().files.values()).map(
            (f) => f.file,
          )
          onChange([...currentFiles])
        }

        if (onUpload) {
          requestAnimationFrame(() => {
            onFilesUpload(validFiles)
          })
        }
      }
    },
    [
      store,
      isControlled,
      onChange,
      onUpload,
      accept,
      maxFiles,
      maxSize,
      disabled,
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

  const contextValue = React.useMemo(
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
}
