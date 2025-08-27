import { type ComponentPropsWithoutRef, type RefObject } from "react"

export type Direction = "ltr" | "rtl"

export interface FileState {
  file: File
  progress: number
  error?: string
  status: "idle" | "uploading" | "error" | "success"
}

export interface StoreState {
  files: Map<File, FileState>
  dragOver: boolean
  invalid: boolean
}

export type StoreAction =
  | { type: "ADD_FILES"; files: File[] }
  | { type: "SET_FILES"; files: File[] }
  | { type: "SET_PROGRESS"; file: File; progress: number }
  | { type: "SET_SUCCESS"; file: File }
  | { type: "SET_ERROR"; file: File; error: string }
  | { type: "REMOVE_FILE"; file: File }
  | { type: "SET_DRAG_OVER"; dragOver: boolean }
  | { type: "SET_INVALID"; invalid: boolean }
  | { type: "CLEAR" }

export interface FileUploadContextValue {
  inputId: string
  dropzoneId: string
  listId: string
  labelId: string
  disabled: boolean
  dir: Direction
  inputRef: RefObject<HTMLInputElement | null>
  urlCache: WeakMap<File, string>
}

export interface FileUploadItemContextValue {
  id: string
  fileState: FileState | undefined
  nameId: string
  sizeId: string
  statusId: string
  messageId: string
}

export interface FileUploadRootProps
  extends Omit<ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange"> {
  value?: File[]
  defaultValue?: File[]
  onChange?: (files: File[]) => void

  accept?: string
  maxFiles?: number
  maxSize?: number

  disabled?: boolean
  multiple?: boolean
  required?: boolean

  label?: string
  name?: string

  onUpload?: (
    files: File[],
    options: {
      onProgress: (file: File, progress: number) => void
      onSuccess: (file: File) => void
      onError: (file: File, error: Error) => void
    },
  ) => Promise<void> | void

  onValidationError?: (
    errors: Array<{
      file: File
      type: "size" | "format" | "count" | "unknown"
      message: string
    }>,
  ) => void

  dir?: Direction
  asChild?: boolean
}

export interface FileUploadDropzoneProps
  extends ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
}

export interface FileUploadTriggerProps
  extends ComponentPropsWithoutRef<"button"> {
  asChild?: boolean
}

export interface FileUploadListProps extends ComponentPropsWithoutRef<"div"> {
  orientation?: "horizontal" | "vertical"
  asChild?: boolean
  forceMount?: boolean
}

export interface FileUploadItemProps extends ComponentPropsWithoutRef<"div"> {
  value: File
  asChild?: boolean
}

export interface FileUploadItemMetadataProps
  extends ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
  size?: "default" | "sm"
}

export interface FileUploadItemProgressProps
  extends ComponentPropsWithoutRef<"div"> {
  variant?: "linear" | "circular" | "fill"
  size?: number
  asChild?: boolean
  forceMount?: boolean
}

export interface FileUploadItemDeleteProps
  extends ComponentPropsWithoutRef<"button"> {
  asChild?: boolean
}

export interface FileUploadClearProps
  extends ComponentPropsWithoutRef<"button"> {
  forceMount?: boolean
  asChild?: boolean
}
