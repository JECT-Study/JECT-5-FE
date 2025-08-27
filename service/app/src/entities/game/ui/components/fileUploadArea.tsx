"use client"

import { PrimaryBoxButton } from "@shared/design/src/components/button"
import {
  Dropzone,
  FileUpload,
  FileUploadTrigger,
} from "@shared/design/src/components/upload"
import Image from "next/image"

import { useGameCreationContext } from "../../model/state/create/gameCreationContext"
import { useGamePopupActions } from "../../model/useGamePopupActions"

export function FileUploadArea() {
  const { actions, selectors } = useGameCreationContext()
  const { showFileUploadError } = useGamePopupActions()
  const selectedQuestion = selectors.selectedQuestion

  const hasImage =
    selectedQuestion?.imageUrl || selectedQuestion?.previewImageUrl

  const handleFileChange = (files: File[]) => {
    if (!selectedQuestion || files.length === 0) {
      return
    }

    const file = files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string
      actions.uploadImageStart(selectedQuestion.id, file, previewUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async (
    files: File[],
    options: {
      onProgress: (file: File, progress: number) => void
      onSuccess: (file: File) => void
      onError: (file: File, error: Error) => void
    },
  ) => {
    try {
      for (const file of files) {
        options.onSuccess(file)
      }
    } catch (error) {
      console.error("File upload error:", error)
      showFileUploadError()
      for (const file of files) {
        options.onError(file, error as Error)
      }
    }
  }

  const handleValidationError = (
    errors: Array<{
      file: File
      type: "size" | "format" | "count" | "unknown"
      message: string
    }>,
  ) => {
    // 에러 타입별로 적절한 처리
    const hasSizeError = errors.some((error) => error.type === "size")
    const hasFormatError = errors.some((error) => error.type === "format")
    const hasCountError = errors.some((error) => error.type === "count")

    // 현재는 모든 검증 에러에 대해 동일한 팝업을 표시
    // 향후 필요에 따라 에러 타입별로 다른 팝업을 표시할 수 있음
    if (hasSizeError || hasFormatError || hasCountError) {
      showFileUploadError()
    }
  }

  return (
    <FileUpload
      key={selectedQuestion?.id}
      onChange={handleFileChange}
      onUpload={handleUpload}
      onValidationError={handleValidationError}
      accept="image/jpeg,image/jpg,image/png"
      maxFiles={1}
      maxSize={2 * 1024 * 1024}
      label="이미지 업로드"
    >
      <Dropzone className="flex h-[632px] w-[577px] flex-col items-center justify-center gap-[22px] p-[10px]">
        {hasImage ? (
          <div className="group relative size-full">
            <Image
              src={
                selectedQuestion.imageUrl || selectedQuestion.previewImageUrl!
              }
              alt="업로드된 이미지"
              fill
              className="rounded-[10px] object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-[10px] bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <FileUploadTrigger asChild>
                <PrimaryBoxButton size="md">이미지 변경</PrimaryBoxButton>
              </FileUploadTrigger>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-[22px]">
            <h3 className="typography-heading-lg-semibold text-center text-text-interactive-tertiary">
              파일 업로드
            </h3>
            <p className="typography-heading-sm-medium text-center text-text-interactive-tertiary">
              JPG, JPEG, PNG (최대 2MB)
            </p>
          </div>
        )}
      </Dropzone>
    </FileUpload>
  )
}
