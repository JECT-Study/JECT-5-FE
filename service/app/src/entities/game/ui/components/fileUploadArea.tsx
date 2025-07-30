"use client"

import { Dropzone, FileUpload } from "@shared/design/src/components/upload"

import { usePopup } from "../popupManager"

export function FileUploadArea() {
  const { showPopup } = usePopup()

  const handleFileUpload = (files: File[]) => {
    for (const file of files) {
      if (file.size > 2 * 1024 * 1024) {
        showPopup("fileSizeError")
        return
      }

      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]
      if (!allowedTypes.includes(file.type)) {
        showPopup("fileTypeError")
        return
      }
    }
  }

  return (
    <FileUpload onValueChange={handleFileUpload}>
      <Dropzone className="flex h-[632px] w-[577px] flex-col items-center justify-center gap-[22px] p-[10px]">
        <div className="flex flex-col items-center gap-[22px]">
          <h3 className="typography-heading-lg-semibold text-center text-text-interactive-tertiary">
            파일 업로드
          </h3>
          <p className="typography-heading-sm-medium text-center text-text-interactive-tertiary">
            JPG, JPEG, PNG (최대 2MB)
          </p>
        </div>
      </Dropzone>
    </FileUpload>
  )
} 