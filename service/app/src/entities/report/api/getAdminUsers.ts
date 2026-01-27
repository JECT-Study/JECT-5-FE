import { fetchClient } from "@/shared/api/fetchClient"

import type { AdminUsersResponse } from "../model/types"

export interface GetAdminUsersParams {
  page?: number
}

export const getAdminUsers = async (
  params: GetAdminUsersParams = {},
): Promise<AdminUsersResponse> => {
  const { page = 0 } = params
  const queryString = page > 0 ? `?page=${page}` : ""
  const response = await fetchClient.get<AdminUsersResponse>(
    `admin/users${queryString}`,
  )
  return response.json().then((res) => res.data)
}
