import { useQuery } from "@tanstack/react-query"

import { getReportDetail } from "../api/getReportDetail"
import type { ReportDetailData } from "../model/types"

interface UseReportDetailParams {
  reportId: number
  enabled?: boolean
}

export const useReportDetail = ({
  reportId,
  enabled = true,
}: UseReportDetailParams) => {
  const { data } = useQuery<ReportDetailData>({
    queryKey: ["reportDetail", reportId] as const,
    queryFn: async () => {
      const response = await getReportDetail(reportId)
      return response
    },
    enabled,
    staleTime: 0,
    retry: 2,
  })

  return { data }
}
