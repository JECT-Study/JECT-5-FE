// import ky, { type OptionsInit } from "ky"

// import type { ResponsePromise } from "@/shared/api/type"

// export type RequestInterceptor = {
//   onFulfilled: (
//     url: string,
//     options: RequestInit,
//   ) => Promise<{ url: string; options: RequestInit }>
//   onRejected?: (error: unknown) => Promise<never>
// }

// export type ResponseInterceptor = {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   onFulfilled: (response: any) => any
//   onRejected?: (error: unknown) => Promise<never>
// }

// type RequestExecutor = <T = unknown>(
//   path: string,
//   options?: RequestInit,
// ) => ResponsePromise<T>

// type GetOptions = Omit<RequestInit, "method" | "body">
// type MutateOptions = Omit<RequestInit, "method">

// const toHeaderObject = (headers?: HeadersInit): Record<string, string> => {
//   if (!headers) {
//     return {}
//   }

//   if (headers instanceof Headers) {
//     const result: Record<string, string> = {}
//     headers.forEach((value, key) => {
//       result[key] = value
//     })
//     return result
//   }

//   if (Array.isArray(headers)) {
//     return headers.reduce<Record<string, string>>((acc, [key, value]) => {
//       acc[key] = value
//       return acc
//     }, {})
//   }

//   return headers
// }

// const normalizeBody = (value: unknown): BodyInit | undefined => {
//   if (value === undefined) {
//     return undefined
//   }

//   if (value === null) {
//     return "null"
//   }

//   if (typeof value === "string") {
//     return value
//   }

//   if (typeof FormData !== "undefined" && value instanceof FormData) {
//     return value
//   }

//   if (
//     typeof URLSearchParams !== "undefined" &&
//     value instanceof URLSearchParams
//   ) {
//     return value
//   }

//   if (typeof Blob !== "undefined" && value instanceof Blob) {
//     return value
//   }

//   return JSON.stringify(value)
// }

// const createMutateInit = <B>(
//   method: string,
//   body: B | undefined,
//   options?: MutateOptions,
// ): RequestInit => {
//   const { body: optionsBody, ...rest } = options || {}
//   const payload = body === undefined ? optionsBody : normalizeBody(body)

//   const init: RequestInit = {
//     ...rest,
//     method,
//   }

//   if (payload !== undefined) {
//     init.body = payload
//   }

//   return init
// }

// const createResponsePromise = <T = unknown>(
//   executor: () => Promise<Response>,
// ): ResponsePromise<T> => {
//   const rawPromise = executor().then((response) => {
//     const augmented = Object.assign(response, {
//       json: <J = T>() => response.clone().json() as Promise<J>,
//     }) as Response & { json: <J = T>() => Promise<J> }

//     return augmented
//   })

//   const responsePromise = rawPromise as ResponsePromise<T>

//   responsePromise.arrayBuffer = () =>
//     rawPromise.then((response) => response.clone().arrayBuffer())

//   responsePromise.blob = () =>
//     rawPromise.then((response) => response.clone().blob())

//   responsePromise.formData = () =>
//     rawPromise.then((response) => response.clone().formData())

//   responsePromise.bytes = () =>
//     rawPromise.then(async (response) => {
//       const buffer = await response.clone().arrayBuffer()
//       return new Uint8Array(buffer)
//     })

//   responsePromise.json = () => rawPromise.then((response) => response.json())

//   responsePromise.text = () =>
//     rawPromise.then((response) => response.clone().text())

//   return responsePromise
// }

// export interface FetchClientOptions {
//   baseUrl: string
//   defaultHeaders?: Record<string, string>
//   timeout?: number
//   credentials?: RequestCredentials
// }

// export interface FetchClientInstance {
//   request: RequestExecutor
//   fetch: RequestExecutor
//   get: <T = unknown>(path: string, options?: GetOptions) => ResponsePromise<T>
//   head: <T = unknown>(path: string, options?: GetOptions) => ResponsePromise<T>
//   delete: <T = unknown>(
//     path: string,
//     options?: MutateOptions,
//   ) => ResponsePromise<T>
//   post: <T = unknown, B = unknown>(
//     path: string,
//     body?: B,
//     options?: MutateOptions,
//   ) => ResponsePromise<T>
//   put: <T = unknown, B = unknown>(
//     path: string,
//     body?: B,
//     options?: MutateOptions,
//   ) => ResponsePromise<T>
//   patch: <T = unknown, B = unknown>(
//     path: string,
//     body?: B,
//     options?: MutateOptions,
//   ) => ResponsePromise<T>
//   addRequestInterceptor: (
//     onFulfilled: RequestInterceptor["onFulfilled"],
//     onRejected?: RequestInterceptor["onRejected"],
//   ) => void
//   addResponseInterceptor: (
//     onFulfilled: ResponseInterceptor["onFulfilled"],
//     onRejected?: ResponseInterceptor["onRejected"],
//   ) => void
//   removeRequestInterceptor: (index: number) => void
//   removeResponseInterceptor: (index: number) => void
// }

// export const createFetchClient = ({
//   baseUrl,
//   defaultHeaders = {},
//   timeout,
//   credentials,
// }: FetchClientOptions): FetchClientInstance => {
//   const requestInterceptors: RequestInterceptor[] = []
//   const responseInterceptors: ResponseInterceptor[] = []

//   const baseKyOptions: OptionsInit = {
//     throwHttpErrors: false,
//     retry: {
//       limit: 0,
//     },
//     ...(timeout !== undefined ? { timeout } : {}),
//     ...(credentials ? { credentials } : {}),
//   }

//   const addRequestInterceptor = (
//     onFulfilled: RequestInterceptor["onFulfilled"],
//     onRejected?: RequestInterceptor["onRejected"],
//   ) => {
//     requestInterceptors.push({ onFulfilled, onRejected })
//   }

//   const addResponseInterceptor = (
//     onFulfilled: ResponseInterceptor["onFulfilled"],
//     onRejected?: ResponseInterceptor["onRejected"],
//   ) => {
//     responseInterceptors.push({ onFulfilled, onRejected })
//   }

//   const removeRequestInterceptor = (index: number) => {
//     if (index >= 0 && index < requestInterceptors.length)
//       requestInterceptors.splice(index, 1)
//   }

//   const removeResponseInterceptor = (index: number) => {
//     if (index >= 0 && index < responseInterceptors.length)
//       responseInterceptors.splice(index, 1)
//   }

//   const executeRequest = <T = unknown>(
//     path: string,
//     options: RequestInit = {},
//   ): ResponsePromise<T> =>
//     createResponsePromise<T>(async () => {
//       let url = new URL(path, baseUrl).toString()
//       const { headers: optionHeaders, ...restOptions } = options
//       let fetchOptions: RequestInit = {
//         ...restOptions,
//         headers: { ...defaultHeaders, ...toHeaderObject(optionHeaders) },
//         ...(credentials && { credentials }),
//       }

//       for (const { onFulfilled, onRejected } of requestInterceptors) {
//         try {
//           const result = await onFulfilled(url, fetchOptions)
//           url = result.url
//           fetchOptions = result.options
//         } catch (error) {
//           if (onRejected) await onRejected(error)
//           else throw error
//         }
//       }

//       let response: Response
//       try {
//         response = await ky(url, {
//           ...baseKyOptions,
//           ...fetchOptions,
//           headers: fetchOptions.headers,
//         })
//       } catch (error) {
//         for (const { onRejected } of responseInterceptors) {
//           if (onRejected) await onRejected(error)
//         }
//         throw error
//       }

//       let processed: Response = response

//       for (const { onFulfilled, onRejected } of responseInterceptors) {
//         try {
//           processed = await onFulfilled(processed)
//         } catch (error) {
//           if (onRejected) await onRejected(error)
//           else throw error
//         }
//       }

//       return processed
//     })

//   const get = <T = unknown>(path: string, options?: GetOptions) =>
//     executeRequest<T>(path, { ...(options || {}), method: "GET" })

//   const head = <T = unknown>(path: string, options?: GetOptions) =>
//     executeRequest<T>(path, { ...(options || {}), method: "HEAD" })

//   const del = <T = unknown>(path: string, options?: MutateOptions) =>
//     executeRequest<T>(path, createMutateInit("DELETE", undefined, options))

//   const post = <T = unknown, B = unknown>(
//     path: string,
//     body?: B,
//     options?: MutateOptions,
//   ) => executeRequest<T>(path, createMutateInit("POST", body, options))

//   const put = <T = unknown, B = unknown>(
//     path: string,
//     body?: B,
//     options?: MutateOptions,
//   ) => executeRequest<T>(path, createMutateInit("PUT", body, options))

//   const patchRequest = <T = unknown, B = unknown>(
//     path: string,
//     body?: B,
//     options?: MutateOptions,
//   ) => executeRequest<T>(path, createMutateInit("PATCH", body, options))

//   return {
//     request: executeRequest,
//     fetch: executeRequest,
//     get,
//     head,
//     delete: del,
//     post,
//     put,
//     patch: patchRequest,
//     addRequestInterceptor,
//     addResponseInterceptor,
//     removeRequestInterceptor,
//     removeResponseInterceptor,
//   }
// }
