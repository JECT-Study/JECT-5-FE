import { overlay } from "overlay-kit"
import { useCallback } from "react"

import { REPORT_REASON_LABELS } from "@/entities/game/model/report"
import { GamePreviewAdmin } from "@/entities/game/ui/GamePreview"
import { getReportDetail } from "@/entities/report/api/getReportDetail"
import { useAdminReportMutations } from "@/entities/report/hooks/useAdminReportMutations"

export const useAdminGamePreview = () => {
  const { ignoreReportMutation, deleteGameMutation, blockUserMutation } =
    useAdminReportMutations()

  const openAdminPreview = useCallback(
    async (reportId: string) => {
      const data = await getReportDetail(reportId)

      overlay.open(({ close, isOpen }) => {
        const handleIgnoreReport = async () => {
          await ignoreReportMutation.mutateAsync(reportId)
          close()
        }

        const handleDeleteGame = async () => {
          await deleteGameMutation.mutateAsync(reportId)
          close()
        }

        const handleBlockCreator = async () => {
          await blockUserMutation.mutateAsync(data.makerEmail)
        }

        const handleBlockReporter = async () => {
          await blockUserMutation.mutateAsync(data.reporterEmail)
        }

        return (
          <GamePreviewAdmin
            gameTitle={data.gameTitle}
            questionCount={data.quetionCount}
            questions={data.questions.map((q) => ({
              id: q.questionId.toString(),
              title: q.questionText,
              imageUrl: q.imageUrl,
            }))}
            reportData={{
              creator: {
                name: data.makerNickname,
                email: data.makerEmail,
              },
              reporter: {
                name: data.reporterNickname,
                email: data.reporterEmail,
              },
              category:
                REPORT_REASON_LABELS[data.reasonCode] ?? data.reasonCode,
            }}
            onClose={close}
            isOpen={isOpen}
            onIgnoreReport={handleIgnoreReport}
            onDeleteGame={handleDeleteGame}
            onBlockCreator={handleBlockCreator}
            onBlockReporter={handleBlockReporter}
          />
        )
      })
    },
    [ignoreReportMutation, deleteGameMutation, blockUserMutation],
  )

  return { openAdminPreview }
}
