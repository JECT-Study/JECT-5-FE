import z from "zod"

export const reportReasonCodeSchema = z.enum([
  "VIOLENT_OR_DISTURBING_CONTENT",
  "SEXUAL_CONTENT",
  "CYBERBULLYING_OR_HARASSMENT",
  "SUICIDE_OR_SELF_HARM",
  "FRAUD_OR_MISINFORMATION",
  "SPAM_OR_PROMOTION",
  "PRIVACY_VIOLATION",
  "INTELLECTUAL_PROPERTY_INFRINGEMENT",
])

export type ReportReasonCode = z.infer<typeof reportReasonCodeSchema>

export const REPORT_REASON_CODES =
  reportReasonCodeSchema.options as ReadonlyArray<ReportReasonCode>

export const REPORT_REASON_LABELS = {
  VIOLENT_OR_DISTURBING_CONTENT: "폭력적이거나 불편한 컨텐츠",
  SEXUAL_CONTENT: "성적인 컨텐츠",
  CYBERBULLYING_OR_HARASSMENT: "사이버 폭력 또는 괴롭힘",
  SUICIDE_OR_SELF_HARM: "자살 또는 자해",
  FRAUD_OR_MISINFORMATION: "사기 또는 거짓된 정보",
  SPAM_OR_PROMOTION: "스팸 또는 홍보",
  PRIVACY_VIOLATION: "개인정보 침해",
  INTELLECTUAL_PROPERTY_INFRINGEMENT: "지식재산권 침해",
} satisfies Record<ReportReasonCode, string>

export const REPORT_REASON_OPTIONS = REPORT_REASON_CODES.map((value) => ({
  value,
  label: REPORT_REASON_LABELS[value],
}))

export const reportGameRequestSchema = z.object({
  reasonCode: reportReasonCodeSchema,
})

export type ReportGameRequest = z.infer<typeof reportGameRequestSchema>
