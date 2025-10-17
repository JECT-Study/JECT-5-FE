import { fetchClient } from "@/shared/api/fetchClient"
import { UUID } from "@/shared/api/types/common"

import { CreateGameState } from "../../../app/create/store/types"
import {
  createGame,
  getPresignedUrlsForExistingGame,
  getPresignedUrlsForNewGame,
} from "../api"
import { GameCreateRequest, GameUpdateRequest } from "../model"
import { generateUniqueFileName } from "./fileValidation"
import { uploadMultipleFilesToS3 } from "./s3Upload"

export const saveNewGame = async (state: CreateGameState): Promise<UUID> => {
  const questionsWithNewImages = state.questions.filter((q) => q.imageFile)

  const presignedRequest = questionsWithNewImages.map((question) => ({
    imageName: generateUniqueFileName(question.imageFile!.name),
    questionOrder: question.order,
  }))

  const presignedResponse = await getPresignedUrlsForNewGame(presignedRequest)

  if (presignedResponse.result !== "SUCCESS" || !presignedResponse.data) {
    throw new Error("이미지 업로드 준비에 실패했습니다.")
  }

  const gameId = presignedResponse.data.gameId
  const imageUrlMap: Map<number, string> = new Map()

  if (questionsWithNewImages.length > 0) {
    const imageFiles = questionsWithNewImages.map((q) => q.imageFile!)
    const uploadResult = await uploadMultipleFilesToS3(
      imageFiles,
      presignedResponse.data.presignedUrls,
    )

    if (!uploadResult.success) {
      throw new Error(
        "저장 중 오류가 발생했습니다. 네트워크 상태를 확인하거나, 잠시 후 다시 시도해 주세요.",
      )
    }

    presignedResponse.data.presignedUrls.forEach(
      (item: { questionOrder: number; key: string }) => {
        imageUrlMap.set(item.questionOrder, item.key)
      },
    )
  }

  const firstImageKey: string | null =
    imageUrlMap.size > 0 ? (imageUrlMap.values().next().value ?? null) : null

  const gameCreateRequest: GameCreateRequest = {
    gameId,
    gameTitle: state.gameName.trim(),
    gameThumbnailUrl: firstImageKey,
    questions: state.questions.map((question) => ({
      questionOrder: question.order,
      imageUrl: imageUrlMap.get(question.order) || "",
      questionText: question.text.trim(),
      questionAnswer: question.answer.trim(),
    })),
  }

  const createResponse = await createGame(gameCreateRequest)

  if (createResponse.result !== "SUCCESS") {
    throw new Error(
      "저장 중 오류가 발생했습니다. 네트워크 상태를 확인하거나, 잠시 후 다시 시도해 주세요.",
    )
  }

  return gameId
}

export const updateExistingGame = async (
  state: CreateGameState,
  gameId: UUID,
  version: number,
): Promise<UUID> => {
  const questionsWithNewImages = state.questions.filter((q) => q.imageFile)
  const imageUrlMap: Map<number, string> = new Map()

  if (questionsWithNewImages.length > 0) {
    const presignedRequest = questionsWithNewImages.map((question) => ({
      imageName: generateUniqueFileName(question.imageFile!.name),
      questionOrder: question.order,
    }))

    const presignedResponse = await getPresignedUrlsForExistingGame(
      gameId,
      presignedRequest,
    )

    if (presignedResponse.result !== "SUCCESS" || !presignedResponse.data) {
      throw new Error("이미지 업로드 준비에 실패했습니다.")
    }

    const imageFiles = questionsWithNewImages.map((q) => q.imageFile!)
    const uploadResult = await uploadMultipleFilesToS3(
      imageFiles,
      presignedResponse.data.presignedUrls,
    )

    if (!uploadResult.success) {
      throw new Error(
        "저장 중 오류가 발생했습니다. 네트워크 상태를 확인하거나, 잠시 후 다시 시도해 주세요.",
      )
    }

    presignedResponse.data.presignedUrls.forEach(
      (item: { questionOrder: number; key: string }) => {
        imageUrlMap.set(item.questionOrder, item.key)
      },
    )
  }

  const firstQuestionWithImage = state.questions.find(
    (q) => imageUrlMap.has(q.order) || q.imageUrl,
  )
  const firstImageKey = firstQuestionWithImage
    ? imageUrlMap.get(firstQuestionWithImage.order) ||
      firstQuestionWithImage.imageUrl
    : null

  const gameUpdateRequest: GameUpdateRequest = {
    version,
    gameTitle: state.gameName.trim(),
    gameThumbnailUrl: firstImageKey,
    questions: state.questions.map((question) => ({
      questionOrder: question.order,
      imageUrl: imageUrlMap.get(question.order) || question.imageUrl,
      questionText: question.text.trim(),
      questionAnswer: question.answer.trim(),
    })),
  }

  const response = await fetchClient
    .put<null>(`games/${gameId}`, {
      json: gameUpdateRequest,
    })
    .json()

  if (response.result !== "SUCCESS") {
    throw new Error(response.error ?? "저장 중 오류가 발생했습니다.")
  }

  return gameId
}
