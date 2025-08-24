import { z } from "zod"

export const gamePlaySchema = z.object({
  q: z.string().default("1").transform(Number),
})
