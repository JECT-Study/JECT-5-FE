import { GameListItem } from "@/entities/game"

import { generateMockGameList } from "../utils/mockGenerators"
import { generateCommonErrorResponse } from "../utils/responseHelpers"

export const loginRequiredError = generateCommonErrorResponse.loginRequired()
export const internalServerError =
  generateCommonErrorResponse.internalServerError()

export const mockGameList: GameListItem[] = generateMockGameList(100)
