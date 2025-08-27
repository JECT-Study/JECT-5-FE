"use client"

import { Slot } from "radix-ui"
import { useCallback, useEffect, useId, useMemo, useRef } from "react"
import { type ChangeEvent } from "react"

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
  FileUploadContext,
  FileUploadStoreProvider,
  useDirection,
  useFileUploadStore,
} from "./hooks"
import type { FileState, FileUploadRootProps } from "./types"
import { useLazyRef, validateFiles } from "./utils"

function FileUploadContent(props: FileUploadRootProps) {
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

  const inputId = useId()
  const dropzoneId = useId()
  const listId = useId()
  const labelId = useId()

  const dir = useDirection(dirProp)
  const urlCache = useLazyRef(() => new WeakMap<File, string>()).current
  const inputRef = useRef<HTMLInputElement>(null)
  const isControlled = value !== undefined
  const store = useFileUploadStore()

  const onProgress = useLazyRef(() => {
    let frame = 0
    return (file: File, progress: number) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        store.setProgress(file, Math.min(Math.max(0, progress), 100))
      })
    }
  }).current

  useEffect(() => {
    if (isControlled) {
      store.dispatch({ type: "SET_FILES", files: value })
    } else if (
      defaultValue &&
      defaultValue.length > 0 &&
      !store.state.files.size
    ) {
      store.dispatch({ type: "SET_FILES", files: defaultValue })
    }
  }, [value, defaultValue, isControlled, store])

  useEffect(() => {
    return () => {
      // URL 정리는 별도로 처리 필요
    }
  }, [urlCache])

  const onFilesUpload = useCallback(
    async (files: File[]) => {
      try {
        for (const file of files) {
          store.setProgress(file, 0)
        }

        if (onUpload) {
          await onUpload(files, {
            onProgress,
            onSuccess: (file) => {
              store.setSuccess(file)
            },
            onError: (file, error) => {
              store.setError(file, error.message ?? "Upload failed")
            },
          })
        } else {
          for (const file of files) {
            store.setSuccess(file)
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed"
        for (const file of files) {
          store.setError(file, errorMessage)
        }
      }
    },
    [store, onUpload, onProgress],
  )

  const onFilesChange = useCallback(
    (originalFiles: File[]) => {
      if (disabled) return

      const currentFileCount = store.state.files.size
      const { validFiles, invalidFiles } = validateFiles(originalFiles, {
        accept,
        maxFiles,
        maxSize,
        currentFileCount,
      })

      if (invalidFiles.length > 0) {
        store.setInvalid(true)
        setTimeout(() => {
          store.setInvalid(false)
        }, 2000)
      }

      if (validFiles.length > 0) {
        store.addFiles(validFiles)

        if (isControlled && onChange) {
          const currentFiles = Array.from(store.state.files.values()).map(
            (f: FileState) => f.file,
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

  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? [])
      onFilesChange(files)
      event.target.value = ""
    },
    [onFilesChange],
  )

  const contextValue = useMemo(
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
    <FileUploadContext.Provider value={contextValue}>
      <RootPrimitive
        role="region"
        aria-label={label ?? "파일 업로드"}
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
          aria-label="파일 선택"
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
          {label ?? "파일 업로드"}
        </span>
      </RootPrimitive>
    </FileUploadContext.Provider>
  )
}

function FileUploadRoot(props: FileUploadRootProps) {
  const { onChange, ...restProps } = props

  return (
    <FileUploadStoreProvider onValueChange={onChange}>
      <FileUploadContent {...restProps} />
    </FileUploadStoreProvider>
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
