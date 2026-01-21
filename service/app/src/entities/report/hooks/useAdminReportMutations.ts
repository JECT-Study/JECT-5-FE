import { useMutation } from "@tanstack/react-query"

import { blockUsers } from "@/entities/suspension/api/blockUsers"
import { queryClient } from "@/shared/lib/queryClient"

import { updateAdminReportStatus } from "../api/updateAdminReportStatus"

export const useAdminReportMutations = () => {
  const ignoreReportMutation = useMutation({
    mutationFn: (reportId: number) =>
      updateAdminReportStatus({ status: "IGNORE_REPORT", reportId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminReports"] })
    },
  })

  const deleteGameMutation = useMutation({
    mutationFn: (reportId: number) =>
      updateAdminReportStatus({ status: "DELETE_GAME", reportId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminReports"] })
    },
  })

  const blockUserMutation = useMutation({
    mutationFn: (email: string) =>
      blockUsers({
        banList: [{ email }],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminReports"] })
    },
  })

  return {
    ignoreReportMutation,
    deleteGameMutation,
    blockUserMutation,
  }
}
