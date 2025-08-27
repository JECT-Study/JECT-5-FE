import { createContext, useContext } from "react"

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

const DirectionContext = createContext<Direction | undefined>(undefined)

function useDirection(dirProp?: Direction): Direction {
  const contextDir = useContext(DirectionContext)
  return dirProp ?? contextDir ?? "ltr"
}

const FileUploadContext = createContext<FileUploadContextValue | null>(null)

function useFileUploadContext(consumerName: string) {
  const context = useContext(FileUploadContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\``)
  }
  return context
}

const FileUploadItemContext = createContext<FileUploadItemContextValue | null>(
  null,
)

function useFileUploadItemContext(consumerName: string) {
  const context = useContext(FileUploadItemContext)
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
  useDirection,
  useFileUploadContext,
  useFileUploadItemContext,
}
