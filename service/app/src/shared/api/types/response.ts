import z from "zod"

export interface ErrorResponse<T = unknown> {
  code: string
  message: string
  data: null | T
}

export type ApiSuccess<T = unknown> = {
  result: "SUCCESS"
  data: T
  error: null
}

export type ApiError<T = unknown> = {
  result: "ERROR"
  data: null
  error: ErrorResponse<T>
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError

export class FetchError extends Error {
  errorCode: string
  status: number
  constructor(status: number, error: z.infer<typeof errorSchema>["error"]) {
    super()
    this.name = "fetcherror"
    this.status = status
    this.errorCode = error.code
    this.message = error.message || this.message
  }
}

export const isFetchError = (e: unknown): e is FetchError => {
  return e instanceof FetchError && e.name === "fetcherror"
}

//ApiError, ApiSuccess를 판단하기 위한 schema
export const errorSchema = z.object({
  result: z.literal("ERROR"),
  data: z.null(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    data: z.object().nullable(),
  }),
})

export const successSchema = z.object({
  result: z.literal("SUCCESS"),
  data: z.object().nullable(),
  error: z.null(),
})
