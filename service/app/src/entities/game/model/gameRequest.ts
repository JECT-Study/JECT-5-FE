import { UUID } from "@shared/types/common"

export interface MyGameQueryParams {
  cursorGameId?: UUID
  cursorUpdatedAt?: string
  limit: number
}

export interface GameQueryParams {
  cursorGameId?: UUID
  cursorPlayCount?: number
  cursorUpdatedAt?: string
  limit: number
  query?: string
}

export interface GameIdPathVar {
  gameId: UUID
}

export interface GameCreateQuestion {
  questionOrder: number
  imageUrl: string
  questionText: string
  questionAnswer: string
}

export interface GameUpdateQuestion {
  questionOrder: number
  imageUrl: string | null
  questionText: string
  questionAnswer: string
  version: number | null
}

export interface GameCreateRequest {
  gameId: UUID
  gameTitle: string
  gameCreatorEmail: string
  gameThumbnailUrl: string | null
  questions: GameCreateQuestion[]
}

export interface GameUpdateRequest {
  gameTitle: string
  gameCreatorEmail: string
  gameThumbnailUrl: string | null
  questions: GameUpdateQuestion[]
  version: number
}

interface PresignedUrlImage {
  imageName: string
  questionOrder: number
}

export interface PresignedUrlRequest {
  images: PresignedUrlImage[]
}
