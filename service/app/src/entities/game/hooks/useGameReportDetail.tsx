import { overlay } from "overlay-kit"
import { useCallback } from "react"

import { REPORT_REASON_LABELS } from "@/entities/game/model/report"
import { GamePreviewAdmin } from "@/entities/game/ui/GamePreview"
import { getReportDetail } from "@/entities/report/api/getReportDetail"

export const useAdminGamePreview = () => {
  const openAdminPreview = useCallback(async (reportId: string | number) => {
    const data = await getReportDetail(reportId)

    overlay.open(({ close, isOpen }) => (
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
          category: REPORT_REASON_LABELS[data.reasonCode] ?? data.reasonCode,
        }}
        onClose={close}
        isOpen={isOpen}
      />
    ))
  }, [])

  return { openAdminPreview }
}
