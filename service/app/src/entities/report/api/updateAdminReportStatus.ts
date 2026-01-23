import { fetchClient } from "@/shared/api/fetchClient"

import type { AdminReportUpdateRequest } from "../model/types"

export const updateAdminReportStatus = async (
  payload: AdminReportUpdateRequest,
) => {
  const response = await fetchClient.post<null>("admin/games/delete", {
    json: payload,
  })

  return response.json()
}
