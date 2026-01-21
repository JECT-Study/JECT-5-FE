import { useQuery } from "@tanstack/react-query"

import { getAdminReports } from "../api/getAdminReports"
import type { ReportedGame } from "../model/types"
import { mapAdminReportToReportedGame } from "../utils/mapAdminReportToReportedGame"

interface UseAdminReportsParams {
  page?: number
  enabled?: boolean
}

interface UseAdminReportsReturn {
  games: ReportedGame[]
  currentPage: number
  totalPages: number
  totalElements: number
  isLoading: boolean
  error: Error | null
}

export const useAdminReports = ({
  page = 0,
  enabled = true,
}: UseAdminReportsParams = {}): UseAdminReportsReturn => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["adminReports", { page }] as const,
    queryFn: async () => {
      const response = await getAdminReports({ page })
      return response
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })

  const games: ReportedGame[] =
    data?.report.map((report) => mapAdminReportToReportedGame(report)) ?? []

  return {
    games,
    currentPage: data?.page ?? page,
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    isLoading,
    error: error as Error | null,
  }
}
