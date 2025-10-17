import { GameListItem, GameQuestion } from "@/entities/game"
import { UUID } from "@/shared/api/types/common"

import { generateMockGameList } from "../utils/mockGenerators"
import { generateCommonErrorResponse } from "../utils/responseHelpers"

export const loginRequiredError = generateCommonErrorResponse.loginRequired()
export const internalServerError =
  generateCommonErrorResponse.internalServerError()

export const mockGameList: GameListItem[] = generateMockGameList(100, 123)

export const mockGameQuestions: Map<UUID, GameQuestion[]> = new Map()
