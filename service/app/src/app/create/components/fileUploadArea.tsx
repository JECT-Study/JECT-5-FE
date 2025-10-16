"use client"

import {
  PrimaryBoxButton,
  SecondaryGhostIconButton,
} from "@shared/design/src/components/button"
import {
  Dropzone,
  FileUpload,
  FileUploadTrigger,
} from "@shared/design/src/components/upload"
import { Cross } from "@shared/design/src/icons"
import Image from "next/image"
import { useShallow } from "zustand/react/shallow"

import { validateImageFile } from "@/entities/game/utils/fileValidation"

import { useCreateGameStore } from "../store/useCreateGameStore"
import { openErrorDialog } from "./dialog/errorDialog"

export function FileUploadArea() {
  const { selectedQuestionId, uploadImage, deleteImage } = useCreateGameStore(
    useShallow((state) => ({
      selectedQuestionId: state.selectedQuestionId,
      uploadImage: state.uploadImage,
      deleteImage: state.deleteImage,
    })),
  )

  const selectedQuestion = useCreateGameStore(
    useShallow((state) =>
      state.questions.find((q) => q.id === selectedQuestionId),
    ),
  )

  const hasImage =
    selectedQuestion?.imageUrl || selectedQuestion?.previewImageUrl

  const handleFileAccept = (files: File[]) => {
    const file = files[0]

    const validation = validateImageFile(file)
    if (!validation.isValid) {
      openErrorDialog({
        description:
          "JPG, JPEG, PNG 형식만 가능하며,최대 2MB까지 업로드할 수 있습니다.",
      })
      return
    }

    const previewUrl = URL.createObjectURL(file)
    uploadImage(selectedQuestionId, file, previewUrl)
  }

  return (
    <FileUpload onAccept={handleFileAccept}>
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
              <SecondaryGhostIconButton
                className="absolute right-5 top-5"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteImage(selectedQuestionId)
                }}
              >
                <Cross />
              </SecondaryGhostIconButton>
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
