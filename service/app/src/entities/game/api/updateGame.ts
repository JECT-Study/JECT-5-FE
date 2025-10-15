import { fetchClient } from "@/shared/api/fetchClient"
import { UUID } from "@/shared/api/types/common"

import { GameUpdateRequest } from "../model"
import { generateUniqueFileName, validateMultipleFiles } from "../utils"
import { createErrorResponse } from "../utils/errorHandlers"
import { uploadMultipleFilesToS3 } from "../utils/s3Upload"
import { getPresignedUrlsForExistingGame } from "./getPresignedUrl"

export const updateGame = async (
  gameData: GameUpdateRequest,
  imageFiles: File[],
  gameId: UUID,
) => {
  const validation = validateMultipleFiles(imageFiles)
  if (!validation.isValid) {
    return createErrorResponse(
      400,
      validation.error ?? "Failed to validate image files",
    )
  }
  const fileData = imageFiles.map((file, index) => ({
    imageName:
      file.name == null ? file.name : generateUniqueFileName(file.name),
    questionOrder: index,
  }))

  const presignedResponse = await getPresignedUrlsForExistingGame(
    gameId,
    fileData,
  )

  const uploadResult = await uploadMultipleFilesToS3(
    imageFiles,
    presignedResponse.data.presignedUrls,
  )
  if (!uploadResult.success) {
    return createErrorResponse(
      500,
      uploadResult.error ?? "Failed to upload images to S3",
    )
  }

  const gameUpdateRequest: GameUpdateRequest = {
    ...gameData,
    questions: gameData.questions.map((question, index) => ({
      ...question,
      imageUrl: imageFiles[index]
        ? presignedResponse.data!.presignedUrls[index].key
        : question.imageUrl,
    })),
  }

  const response = await fetchClient.put<null>(`games/${gameId}`, {
    json: gameUpdateRequest,
  })

  return response.json()
}

export const updateGameWithoutNewImages = async (
  gameData: GameUpdateRequest,
  gameId: UUID,
) => {
  const response = await fetchClient.put<null>(`games/${gameId}`, {
    json: gameData,
  })

  return response.json()
}
