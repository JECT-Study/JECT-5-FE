"use client"

import { PrimaryBoxButton } from "@shared/design/src/components/button"
import {
  Dropzone,
  FileUpload,
  FileUploadTrigger,
} from "@shared/design/src/components/upload"
import Image from "next/image"

import { useGameCreationContext } from "../../model/state/create/gameCreationContext"
import { validateImageFile } from "../../utils/fileValidation"
import { usePopup } from "../popupManager"

export function FileUploadArea() {
  const { actions, selectors } = useGameCreationContext()
  const { showPopup } = usePopup()
  const selectedQuestion = selectors.selectedQuestion

  const hasImage =
    selectedQuestion?.imageUrl || selectedQuestion?.previewImageUrl

  const handleFileUpload = (files: File[]) => {
    if (!selectedQuestion) {
      return
    }

    const file = files[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.isValid) {
      if (validation.error === "FILE_SIZE_TOO_LARGE") {
        showPopup("fileSizeError")
      } else if (validation.error === "INVALID_FILE_TYPE") {
        showPopup("fileTypeError")
      }
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string
      actions.uploadImageStart(selectedQuestion.id, file, previewUrl)
    }
    reader.readAsDataURL(file)
  }

  return (
    <FileUpload onValueChange={handleFileUpload}>
      <Dropzone className="flex h-[632px] w-[577px] flex-col items-center justify-center gap-[22px] p-[10px]">
        {hasImage ? (
          <div className="group relative mt-4 h-[500px] w-[577px]">
            <Image
              src={
                selectedQuestion.imageUrl || selectedQuestion.previewImageUrl!
              }
              alt="업로드된 이미지"
              width={577}
              height={500}
              className="size-full rounded-[10px] object-cover"
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
