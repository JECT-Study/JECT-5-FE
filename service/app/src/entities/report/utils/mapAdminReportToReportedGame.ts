import type { AdminReport, ReportedGame } from "../model/types"
import { formatReportDate } from "./formatReportDate"

const STATUS_LABEL_MAP: Record<AdminReport["status"], string> = {
  PENDING: "미처리",
  GAME_DELETED: "삭제 완료",
  IGNORED: "신고 무시",
}

export const mapAdminReportToReportedGame = (
  report: AdminReport,
): ReportedGame => {
  return {
    id: report.reportId,
    title: report.gameName,
    creatorName: report.creatorName,
    reporterName: report.reporterName,
    reportedAt: formatReportDate(report.reportedAt),
    statusLabel: STATUS_LABEL_MAP[report.status],
  }
}
