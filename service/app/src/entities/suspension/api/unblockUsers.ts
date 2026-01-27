import { fetchClient } from "@/shared/api/fetchClient"

import type { UnblockUsersRequest } from "../model/types"

export const unblockUsers = async (payload: UnblockUsersRequest) => {
  const response = await fetchClient.post<null>("admin/users/unblock", {
    json: payload,
  })

  return response.json()
}
