import { UUID } from "@shared/types/common"

import {
  GameDetailData,
  GameListData,
  GameListItem,
} from "@/entities/game/model/game"

import { generatePresignedUrlData } from "../utils/mockGenerators"
import {
  generateGameErrorResponse,
  generateSuccessResponse,
} from "../utils/responseHelpers"
import { mockGameList } from "./common"

export const mockGameListData: GameListData = {
  games: mockGameList,
}

export const presignedUrlData = (gameId: UUID, imageCount: number = 0) => {
  return generatePresignedUrlData(gameId, imageCount)
}

export const presignedUrlDataSuccess = (gameId: UUID, imageCount: number) => {
  return generateSuccessResponse(presignedUrlData(gameId, imageCount))
}

export const GameListSuccess = (gameList: GameListItem[]) => {
  return generateSuccessResponse({ games: gameList })
}

export const gameSuccessResponse = () => ({
  result: "SUCCESS",
  data: null,
  error: null,
})

export const gameDetailSuccess = (gameDetailData: GameDetailData) => ({
  result: "SUCCESS",
  data: gameDetailData,
  error: null,
})

export const gameNotFoundError = (gameId: UUID) =>
  generateGameErrorResponse.notFound(gameId)

export const gameUnauthorizedError = () =>
  generateGameErrorResponse.unauthorized()

export const gameConflictError = (gameId: UUID) =>
  generateGameErrorResponse.alreadyExists(gameId)

export const gameModifiedError = (gameId: UUID) =>
  generateGameErrorResponse.modified(gameId)

export const gameMissingFieldsError = () => ({
  result: "ERROR",
  data: null,
  error: {
    code: "E400",
    message: "필수 필드가 누락되었습니다.",
    details: null,
  },
})

export const gameInvalidQuestionsError = () => ({
  result: "ERROR",
  data: null,
  error: {
    code: "E400",
    message: "최소 하나 이상의 문제가 필요합니다.",
    details: null,
  },
})

export const gameInvalidQuestionFormatError = () => ({
  result: "ERROR",
  data: null,
  error: {
    code: "E400",
    message: "문제 형식이 올바르지 않습니다.",
    details: null,
  },
})
