import * as React from "react"

import type {
  Direction,
  FileUploadContextValue,
  FileUploadItemContextValue,
} from "../types"

const ROOT_NAME = "FileUpload"
const DROPZONE_NAME = "FileUploadDropzone"
const TRIGGER_NAME = "FileUploadTrigger"
const LIST_NAME = "FileUploadList"
const ITEM_NAME = "FileUploadItem"
const ITEM_METADATA_NAME = "FileUploadItemMetadata"
const ITEM_PROGRESS_NAME = "FileUploadItemProgress"
const ITEM_DELETE_NAME = "FileUploadItemDelete"
const CLEAR_NAME = "FileUploadClear"

const DirectionContext = React.createContext<Direction | undefined>(undefined)

export function useDirection(dirProp?: Direction): Direction {
  const contextDir = React.useContext(DirectionContext)
  return dirProp ?? contextDir ?? "ltr"
}

const FileUploadContext = React.createContext<FileUploadContextValue | null>(
  null,
)

export function useFileUploadContext(consumerName: string) {
  const context = React.useContext(FileUploadContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\``)
  }
  return context
}

const FileUploadItemContext =
  React.createContext<FileUploadItemContextValue | null>(null)

export function useFileUploadItemContext(consumerName: string) {
  const context = React.useContext(FileUploadItemContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ITEM_NAME}\``)
  }
  return context
}

export {
  CLEAR_NAME,
  DirectionContext,
  DROPZONE_NAME,
  FileUploadContext,
  FileUploadItemContext,
  ITEM_DELETE_NAME,
  ITEM_METADATA_NAME,
  ITEM_NAME,
  ITEM_PROGRESS_NAME,
  LIST_NAME,
  ROOT_NAME,
  TRIGGER_NAME,
}
