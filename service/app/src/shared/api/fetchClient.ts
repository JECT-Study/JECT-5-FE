import ky, { type HTTPError, isHTTPError, type Options } from "ky"

import { type ApiError, type ApiSuccess, errorSchema } from "./types/response"

const isDev = process.env.NODE_ENV === "development"
const apiUrl = process.env.NEXT_PUBLIC_API_URL

if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not set")
}

const _instance = ky.create({
  prefixUrl: apiUrl,
  credentials: "include",
  timeout: 10000,
  headers: {
    "content-type": "application/json",
  },
})

export const instance = _instance.extend({
  hooks: {
    beforeRequest: [
      (request, options) => {
        if (isDev) {
          console.log("🚀 Request:", request.url, options)
        }
      },
    ],
    afterResponse: [
      (_request, _options, response) => {
        if (isDev) {
          console.log("📥 Response:", response.status, response.url)
          return response
        }
      },
      (_request, _options, response) => {
        if (response.status === 401 && typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:session-expired"))
        }
      },
    ],
    beforeError: [
      async (error) => {
        if (isDev) {
          console.log("error occured", error.message)
        }
        const cloned = error.response.clone()
        const res = await cloned.json()
        const pendingSchema = errorSchema.safeParse(res)
        if (pendingSchema.success) {
          error.name = "FetchError"
          error.message = `${pendingSchema.data.error.code} ${pendingSchema.data.error.message}`
        } else {
          error.name = "UnknownError"
        }
        return error
      },
    ],
  },
})

export const fetchClient = {
  get: <T>(url: string, options?: Options) =>
    instance.get<ApiSuccess<T>>(url, options),

  post: <T>(url: string, options?: Options) =>
    instance.post<ApiSuccess<T>>(url, options),

  put: <T>(url: string, options?: Options) =>
    instance.put<ApiSuccess<T>>(url, options),

  patch: <T>(url: string, options?: Options) =>
    instance.patch<ApiSuccess<T>>(url, options),

  delete: <T>(url: string, options?: Options) =>
    instance.delete<ApiSuccess<T>>(url, options),
} as const

export const isError = (e: unknown): e is HTTPError<ApiError> => {
  return isHTTPError(e)
}
