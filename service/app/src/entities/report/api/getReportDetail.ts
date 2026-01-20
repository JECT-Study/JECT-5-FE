import { fetchClient } from "@/shared/api/fetchClient"

import type { ReportDetailData } from "../model/types"

export const getReportDetail = async (reportId: string | number) => {
  const response = await fetchClient.get<ReportDetailData>(
    `admin/games/${reportId}`,
  )
  return response.json().then((res) => res.data)
}
