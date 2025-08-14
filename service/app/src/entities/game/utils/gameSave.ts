import { v4 as uuidv4 } from "uuid"

import { createGame, getPresignedUrlsForNewGame } from "../api"
import { GameCreateRequest } from "../model"
import { GameCreationState } from "../model/state/create/state"
import { uploadMultipleFilesToS3 } from "./s3Upload"

export interface GameSaveResult {
  success: boolean
  error?: string
  gameId?: string
}

export const prepareGameData = (
  state: GameCreationState,
): GameCreateRequest => {
  const gameId = uuidv4()

  const firstQuestionWithImage = state.questions.find(
    (question) => question.imageUrl || question.imageFile
  )
  
  const thumbnailUrl = firstQuestionWithImage?.imageUrl || null

  return {
    gameId,
    gameTitle: state.gameName.trim() || "게임1",
    gameCreatorEmail: "user@example.com",
    gameThumbnailUrl: thumbnailUrl,
    questions: state.questions.map((question, index) => ({
      questionOrder: index,
      imageUrl: question.imageUrl || "",
      questionText: question.text.trim(),
      questionAnswer: question.answer.trim(),
    })),
  }
}

export const saveGame = async (
  state: GameCreationState,
): Promise<GameSaveResult> => {
  try {
    // 기본 검증
    if (!state.gameName.trim()) {
      return {
        success: false,
        error: "게임 이름을 입력해주세요.",
      }
    }

    if (state.questions.length === 0) {
      return {
        success: false,
        error: "최소 1개 이상의 질문이 필요합니다.",
      }
    }

    const questionsWithImages = state.questions.filter((q) => q.imageFile)

    let presignedResponse = null

    if (questionsWithImages.length > 0) {
      const presignedRequest = {
        images: questionsWithImages.map((question) => ({
          imageName: `${question.id}.${question.imageFile!.name.split(".").pop()}`,
          questionOrder: question.order,
        })),
      }

      presignedResponse = await getPresignedUrlsForNewGame(
        presignedRequest.images,
      )

      if (presignedResponse.result !== "SUCCESS" || !presignedResponse.data) {
        return {
          success: false,
          error: "Presigned URL 발급에 실패했습니다.",
        }
      }

      const imageFiles = questionsWithImages.map((q) => q.imageFile!)
      const uploadResult = await uploadMultipleFilesToS3(
        imageFiles,
        presignedResponse.data.presignedUrls,
      )

      if (!uploadResult.success) {
        return {
          success: false,
          error: uploadResult.error || "이미지 업로드에 실패했습니다.",
        }
      }
    }

    const gameData = prepareGameData(state)

    if (presignedResponse && presignedResponse.data) {
      gameData.questions = gameData.questions.map((question, index) => {
        const presignedUrl = presignedResponse.data!.presignedUrls[index]
        return {
          ...question,
          imageUrl: presignedUrl ? presignedUrl.key : "",
        }
      })

      const firstImageUrl = presignedResponse.data.presignedUrls[0]?.key
      if (firstImageUrl) {
        gameData.gameThumbnailUrl = firstImageUrl
      }
    }

    const createResponse = await createGame(gameData)

    if (createResponse.result !== "SUCCESS") {
      return {
        success: false,
        error: "게임 저장에 실패했습니다.",
      }
    }

    return {
      success: true,
      gameId: gameData.gameId,
    }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    }
  }
}
