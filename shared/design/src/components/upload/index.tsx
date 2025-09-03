import * as React from "react"

import { cn } from "../../utils/cn"
import { FileUploadDropzone } from "./components/dropzone"
import {
  FileUploadClear,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemProgress,
} from "./components/fileItem"
import { FileUploadList } from "./components/fileList"
import { FileUploadTrigger } from "./components/trigger"
import { FileUpload } from "./upload"

function Dropzone({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof FileUploadDropzone>) {
  return (
    <FileUploadDropzone
      className={cn(
        "flex h-[632px] w-[577px] shrink-0 flex-col items-center justify-center gap-2.5 rounded-[10px] border-[10px] border-dashed border-border-interactive-tertiary p-2.5 hover:border-none hover:bg-background-overlay",
        className,
      )}
      {...props}
    >
      {children}
    </FileUploadDropzone>
  )
}

function Trigger({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof FileUploadTrigger>) {
  return (
    <FileUploadTrigger
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      {children}
    </FileUploadTrigger>
  )
}

export {
  Dropzone,
  FileUpload,
  FileUploadClear,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
  Trigger,
}
