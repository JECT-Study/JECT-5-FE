import ky, { type HTTPError, isHTTPError, type Options } from "ky"

import { type ApiError, type ApiSuccess, errorSchema } from "./types/response"

const isDev = process.env.NODE_ENV === "development"

const _instance = ky.create({
  prefixUrl: process.env.API_URL || "http://localhost:3000",
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
          localStorage.removeItem("auth_user")
          document.cookie =
            "JSESSIONID=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;"
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
