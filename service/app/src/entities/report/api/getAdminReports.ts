import { fetchClient } from "@/shared/api/fetchClient"

import type { AdminReportsResponse } from "../model/types"

export interface GetAdminReportsParams {
  page?: number
}

export const getAdminReports = async (
  params: GetAdminReportsParams = {},
): Promise<AdminReportsResponse> => {
  const { page = 0 } = params
  const queryString = page > 0 ? `?page=${page}` : ""
  const response = await fetchClient.get<AdminReportsResponse>(
    `admin/games${queryString}`,
  )
  return response.json().then((res) => res.data)
}
