"use client"

import { Dropzone, FileUpload } from "@shared/design/src/components/upload"

export function FileUploadArea() {
  return (
    <FileUpload>
      <Dropzone className="w-[577px] h-[632px] flex flex-col justify-center items-center gap-[22px] p-[10px]">
        <div className="flex flex-col items-center gap-[22px]">
          <h3 className="text-[28px] font-semibold text-text-interactive-tertiary text-center">
            파일 업로드
          </h3>
          <p className="text-[19px] font-medium text-text-interactive-tertiary text-center">
            JPG, JPEG, PNG (최대 2MB)
          </p>
        </div>
      </Dropzone>
    </FileUpload>
  )
} 