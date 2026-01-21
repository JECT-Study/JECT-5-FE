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

export interface AdminReport {
  reportId: number
  gameName: string
  creatorName: string
  reporterName: string
  reportedAt: string
  status: "PENDING" | "GAME_DELETED" | "IGNORED"
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
  gameTitle: string
  makerNickname: string
  makerEmail: string
  quetionCount: number
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
}
