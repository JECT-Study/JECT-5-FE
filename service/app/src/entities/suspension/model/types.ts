import z from "zod"

export interface SuspendedUser {
  id: string
  name: string
  email: string
  reason: string
  suspendedAt: string
  blockStatusLabel?: string
}

export const banListItemSchema = z.object({
  email: z.string().min(1),
  reason: z.string().optional(),
})

export const blockUsersRequestSchema = z.object({
  banList: z.array(banListItemSchema).min(1),
})

export const unblockUsersRequestSchema = z.object({
  emails: z.array(z.string().min(1)).min(1),
})

export type BanListItem = z.infer<typeof banListItemSchema>
export type BlockUsersRequest = z.infer<typeof blockUsersRequestSchema>
export type UnblockUsersRequest = z.infer<typeof unblockUsersRequestSchema>
