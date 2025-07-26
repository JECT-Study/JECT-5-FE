export type RequestInterceptor = {
  onFulfilled: (
    url: string,
    options: RequestInit,
  ) => Promise<{ url: string; options: RequestInit }>
  onRejected?: (error: unknown) => Promise<never>
}

export type ResponseInterceptor = {
  onFulfilled: (response: Response) => Promise<Response>
  onRejected?: (error: unknown) => Promise<never>
}

export interface FetchClientOptions {
  baseUrl: string
  defaultHeaders?: Record<string, string>
  timeout?: number
  credentials?: RequestCredentials
}

export interface FetchClientInstance {
  fetch: (path: string, options?: RequestInit) => Promise<Response>
  addRequestInterceptor: (
    onFulfilled: RequestInterceptor["onFulfilled"],
    onRejected?: RequestInterceptor["onRejected"],
  ) => void
  addResponseInterceptor: (
    onFulfilled: ResponseInterceptor["onFulfilled"],
    onRejected?: ResponseInterceptor["onRejected"],
  ) => void
  removeRequestInterceptor: (index: number) => void
  removeResponseInterceptor: (index: number) => void
}

export const createFetchClient = ({
  baseUrl,
  defaultHeaders = {},
  timeout,
  credentials,
}: FetchClientOptions): FetchClientInstance => {
  const requestInterceptors: RequestInterceptor[] = []
  const responseInterceptors: ResponseInterceptor[] = []

  const addRequestInterceptor = (
    onFulfilled: RequestInterceptor["onFulfilled"],
    onRejected?: RequestInterceptor["onRejected"],
  ) => {
    requestInterceptors.push({ onFulfilled, onRejected })
  }

  const addResponseInterceptor = (
    onFulfilled: ResponseInterceptor["onFulfilled"],
    onRejected?: ResponseInterceptor["onRejected"],
  ) => {
    responseInterceptors.push({ onFulfilled, onRejected })
  }

  const removeRequestInterceptor = (index: number) => {
    if (index >= 0 && index < requestInterceptors.length) {
      requestInterceptors.splice(index, 1)
    }
  }

  const removeResponseInterceptor = (index: number) => {
    if (index >= 0 && index < responseInterceptors.length) {
      responseInterceptors.splice(index, 1)
    }
  }

  const fetchInstance = async (path: string, options: RequestInit = {}) => {
    let url = `${baseUrl}${path}`
    let fetchOptions: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
      ...(credentials && { credentials }),
    }

    for (const { onFulfilled, onRejected } of requestInterceptors) {
      try {
        const result = await onFulfilled(url, fetchOptions)
        url = result.url
        fetchOptions = result.options
      } catch (error) {
        if (onRejected) {
          await onRejected(error)
        } else {
          throw error
        }
      }
    }

    if (timeout) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)
      fetchOptions.signal = controller.signal

      const originalSignal = fetchOptions.signal
      if (originalSignal) {
        originalSignal.addEventListener("abort", () => clearTimeout(timeoutId))
      }
    }

    let response: Response
    try {
      const fetchFunction =
        typeof global !== "undefined" && global.fetch
          ? global.fetch
          : typeof window !== "undefined" && window.fetch
            ? window.fetch
            : fetch

      response = await fetchFunction(url, fetchOptions)
    } catch (error) {
      for (const { onRejected } of responseInterceptors) {
        if (onRejected) {
          await onRejected(error)
        }
      }
      throw error
    }

    for (const { onFulfilled, onRejected } of responseInterceptors) {
      try {
        response = await onFulfilled(response)
      } catch (error) {
        if (onRejected) {
          await onRejected(error)
        } else {
          throw error
        }
      }
    }

    return response
  }

  return {
    fetch: fetchInstance,
    addRequestInterceptor,
    addResponseInterceptor,
    removeRequestInterceptor,
    removeResponseInterceptor,
  }
}
