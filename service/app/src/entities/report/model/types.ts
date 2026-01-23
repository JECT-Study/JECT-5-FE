import z from "zod"

import type { ReportReasonCode } from "@/entities/game/model/report"

export interface ReportedGame {
  id: number
  title: string
  creatorName: string
  reporterName: string
  reportedAt: string
  statusLabel: string
}

export interface AdminReportsResponse {
  report: AdminReport[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}

export type AdminReportStatus = "PENDING" | "GAME_DELETED" | "IGNORED"

export interface AdminReport {
  reportId: number
  gameName: string
  creatorName: string
  reporterName: string
  reportedAt: string
  status: AdminReportStatus
}

export const adminReportUpdateStatusSchema = z.enum([
  "IGNORE_REPORT",
  "DELETE_GAME",
])

export type AdminReportUpdateStatus = z.infer<
  typeof adminReportUpdateStatusSchema
>

export const adminReportUpdateRequestSchema = z.object({
  status: adminReportUpdateStatusSchema,
  reportId: z.coerce.number(),
})

export type AdminReportUpdateRequest = z.infer<
  typeof adminReportUpdateRequestSchema
>

export const reportIdParamsSchema = z.object({
  reportId: z.coerce.number(),
})

export type ReportIdParams = z.infer<typeof reportIdParamsSchema>

export interface ReportDetailData {
  status: AdminReportStatus
  gameTitle: string
  makerNickname: string
  makerEmail: string
  questionCount: number
  version: number
  questions: {
    questionId: number
    questionOrder: number
    imageUrl: string
    questionText: string
    questionAnswer: string
    version: number
  }[]
  reporterEmail: string
  reporterNickname: string
  reasonCode: ReportReasonCode
  isMakerBlock: boolean
  isReporterBlock: boolean
}
