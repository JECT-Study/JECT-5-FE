import { fetchClient } from "@/shared/api/fetchClient"

import type { BlockUsersRequest } from "../model/types"

export const blockUsers = async (payload: BlockUsersRequest) => {
  const response = await fetchClient.post<null>("admin/users/block", {
    json: payload,
  })

  return response.json()
}
