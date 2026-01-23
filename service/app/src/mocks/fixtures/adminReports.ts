import type { AdminReport } from "@/entities/report/model/types"

export const adminReportFixtures = {
  pending: (id: number): AdminReport => ({
    reportId: id,
    gameName: "테스트 게임",
    creatorName: "김관리",
    reporterName: "박신고",
    reportedAt: "2026-01-01T00:00:00.000Z",
    status: "PENDING",
  }),

  deleted: (id: number): AdminReport => ({
    ...adminReportFixtures.pending(id),
    status: "GAME_DELETED",
  }),

  ignored: (id: number): AdminReport => ({
    ...adminReportFixtures.pending(id),
    status: "IGNORED",
  }),
}
