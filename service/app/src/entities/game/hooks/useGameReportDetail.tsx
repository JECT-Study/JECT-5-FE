import { overlay } from "overlay-kit"
import { useCallback } from "react"

import { REPORT_REASON_LABELS } from "@/entities/game/model/report"
import { GamePreviewAdmin } from "@/entities/game/ui/GamePreview"
import { getReportDetail } from "@/entities/report/api/getReportDetail"
import { useAdminReportMutations } from "@/entities/report/hooks/useAdminReportMutations"
import { useReportDetail } from "@/entities/report/hooks/useReportDetail"
import { queryClient } from "@/shared/lib/queryClient"

export const useAdminGamePreview = () => {
  const { ignoreReportMutation, deleteGameMutation, blockUserMutation } =
    useAdminReportMutations()

  const openAdminPreview = useCallback(
    async (reportId: number) => {
      await queryClient.fetchQuery({
        queryKey: ["reportDetail", reportId] as const,
        queryFn: async () => {
          const response = await getReportDetail(reportId)
          return response
        },
      })

      overlay.open(({ close, isOpen }) => {
        const Content = () => {
          const { data } = useReportDetail({
            reportId,
            enabled: isOpen,
          })

          const handleIgnoreReport = async () => {
            await ignoreReportMutation.mutateAsync(reportId)
            close()
          }

          const handleDeleteGame = async () => {
            await deleteGameMutation.mutateAsync(reportId)
            close()
          }

          const handleBlockCreator = async () => {
            if (data) {
              await blockUserMutation.mutateAsync(data.makerEmail)
            }
          }

          const handleBlockReporter = async () => {
            if (data) {
              await blockUserMutation.mutateAsync(data.reporterEmail)
            }
          }

          if (!data) {
            return null
          }

          return (
            <GamePreviewAdmin
              gameTitle={data.gameTitle}
              questionCount={data.questionCount}
              questions={data.questions.map((q) => ({
                id: q.questionId,
                title: q.questionText,
                imageUrl: q.imageUrl,
              }))}
              reportData={{
                creator: {
                  name: data.makerNickname,
                  email: data.makerEmail,
                  isBlocked: data.isMakerBlock,
                },
                reporter: {
                  name: data.reporterNickname,
                  email: data.reporterEmail,
                  isBlocked: data.isReporterBlock,
                },
                category:
                  REPORT_REASON_LABELS[data.reasonCode] ?? data.reasonCode,
              }}
              status={data.status}
              onClose={close}
              isOpen={isOpen}
              onIgnoreReport={handleIgnoreReport}
              onDeleteGame={handleDeleteGame}
              onBlockCreator={handleBlockCreator}
              onBlockReporter={handleBlockReporter}
            />
          )
        }

        return <Content />
      })
    },
    [ignoreReportMutation, deleteGameMutation, blockUserMutation],
  )

  return { openAdminPreview }
}
