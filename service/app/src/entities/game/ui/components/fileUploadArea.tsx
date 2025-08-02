"use client"

import { Dropzone, FileUpload } from "@shared/design/src/components/upload"
import Image from "next/image"

import { useGameCreationContext } from "../../model/state/create/gameCreationContext"
import { validateImageFile } from "../../utils/fileValidation"
import { usePopup } from "../popupManager"

export function FileUploadArea() {
  const { actions, selectors } = useGameCreationContext()
  const { showPopup } = usePopup()
  const selectedQuestion = selectors.selectedQuestion

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

    actions.uploadImageStart(selectedQuestion.id, file)
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
          {selectedQuestion?.imageUrl && (
            <div className="mt-4">
              <Image
                src={selectedQuestion.imageUrl}
                alt="업로드된 이미지"
                width={256}
                height={256}
                className="max-h-64 max-w-full object-contain"
              />
            </div>
          )}
        </div>
      </Dropzone>
    </FileUpload>
  )
}
