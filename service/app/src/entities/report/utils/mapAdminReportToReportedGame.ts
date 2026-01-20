import type { AdminReport, ReportedGame } from "../model/types"
import { formatReportDate } from "./formatReportDate"
import { formatReportNumber } from "./formatReportNumber"

const STATUS_LABEL_MAP: Record<AdminReport["status"], string> = {
  PENDING: "미처리",
  RESOLVED: "삭제 완료",
  REJECTED: "신고 무시",
}

export const mapAdminReportToReportedGame = (
  report: AdminReport,
  index: number,
  page: number,
  pageSize: number,
): ReportedGame => {
  const number = page * pageSize + index + 1
  return {
    id: String(report.reportId),
    no: formatReportNumber(number),
    title: report.gameName,
    creatorName: report.creatorName,
    reporterName: report.reporterName,
    reportedAt: formatReportDate(report.reportedAt),
    statusLabel: STATUS_LABEL_MAP[report.status],
  }
}
