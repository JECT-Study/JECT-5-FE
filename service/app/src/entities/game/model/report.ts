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

export const reportGameRequestSchema = z.object({
  reasonCode: reportReasonCodeSchema,
})

export type ReportGameRequest = z.infer<typeof reportGameRequestSchema>
