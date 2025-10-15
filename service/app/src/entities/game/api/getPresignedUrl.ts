import { fetchClient } from "@/shared/api/fetchClient"
import { UUID } from "@/shared/api/types/common"

import { type PresignedUrlData, PresignedUrlRequest } from "../model"

export const getPresignedUrlsForNewGame = async (
  images: PresignedUrlRequest["images"],
) => {
  const response = await fetchClient.post<PresignedUrlData>(
    "games/uploads/urls",
    {
      json: images,
    },
  )

  return response.json()
}

export const getPresignedUrlsForExistingGame = async (
  gameId: UUID,
  images: PresignedUrlRequest["images"],
) => {
  const response = await fetchClient.post<PresignedUrlData>(
    `games/${gameId}/uploads/urls`,
    {
      json: images,
    },
  )
  return response.json()
}
