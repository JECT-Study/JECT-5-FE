"use client"

import { Dropzone, FileUpload } from "@shared/design/src/components/upload"

export function FileUploadArea() {
  return (
    <FileUpload>
      <Dropzone className="flex h-[632px] w-[577px] flex-col items-center justify-center gap-[22px] p-[10px]">
        <div className="flex flex-col items-center gap-[22px]">
          <h3 className="text-center typography-heading-lg-semibold text-text-interactive-tertiary">
            파일 업로드
          </h3>
          <p className="text-center typography-heading-sm-medium text-text-interactive-tertiary">
            JPG, JPEG, PNG (최대 2MB)
          </p>
        </div>
      </Dropzone>
    </FileUpload>
  )
} 