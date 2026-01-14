import z from "zod"

import { fetchClient } from "@/shared/api/fetchClient"
import type { UUID } from "@/shared/api/types/common"

import { reportGameRequestSchema, type ReportReasonCode } from "../model/report"

const reportGameResponseSchema = z.object({
  result: z.literal("SUCCESS"),
  error: z.null(),
  data: z.null(),
})

export type ReportGameResponse = z.infer<typeof reportGameResponseSchema>

export const reportGame = async (
  gameId: UUID,
  reasonCode: ReportReasonCode,
): Promise<ReportGameResponse> => {
  const json = reportGameRequestSchema.parse({ reasonCode })

  const response = await fetchClient.post<null>(`games/${gameId}/report`, {
    json,
  })

  const payload = await response.json()
  return reportGameResponseSchema.parse(payload)
}
