import * as React from "react"

import { cn } from "../../utils/cn"
import {
  FileUpload,
  FileUploadClear,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
} from "./upload"

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

// const TriggerContent = () => {
//   return (
//     <div className="flex items-center justify-center gap-[22px] text-text-interactive-tertiary">
//       <div className="typography-heading-lg-semibold">파일 업로드</div>
//       <div className="typography-heading-sm-medium">
//         JPG, JPEG, PNG (최대 2MB)
//       </div>
//     </div>
//   )
// }

// const TriggerButton = ({ children }) => {
//   return (
//     <PrimaryBoxButton size="md" _style="solid">
//       {children}
//     </PrimaryBoxButton>
//   )
// }

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
