import { z } from "zod"

export const gamePlaySchema = z.object({
  q: z.string().default("1").transform(Number),
  answer: z
    .string()
    .optional()
    .transform((v) => v === "true"),
})
