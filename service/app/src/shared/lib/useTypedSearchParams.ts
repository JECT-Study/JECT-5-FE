"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"
import { z } from "zod"

type NewParamsType = { [key: string]: string }

export const useTypedSearchParams = <T extends z.ZodTypeAny>(schema: T) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const parsedParams = useMemo(() => {
    const params: Record<string, string | string[]> = {}

    searchParams.forEach((value, key) => {
      const existing = params[key]
      if (existing) {
        if (Array.isArray(existing)) {
          existing.push(value)
        } else {
          params[key] = [existing, value]
        }
      } else {
        params[key] = value
      }
    })
    const result = schema.parse(params)

    return result
  }, [schema, searchParams])

  const setSearchParams = useCallback(
    (
      newParams: NewParamsType | ((prev: NewParamsType) => NewParamsType),
      isReplace?: boolean,
    ) => {
      const _newParams =
        typeof newParams === "function"
          ? newParams(Object.fromEntries(searchParams))
          : newParams

      // 새로운 URLSearchParams 생성
      const current = new URLSearchParams(searchParams.toString())

      // 새로운 파라미터 적용
      Object.entries(_newParams).forEach(([key, value]) => {
        if (value) {
          current.set(key, value)
        } else {
          current.delete(key)
        }
      })

      const search = current.toString()
      const query = search ? `?${search}` : ""

      if (isReplace) {
        router.replace(`${pathname}${query}`, { scroll: false })
      } else {
        router.push(`${pathname}${query}`, { scroll: false })
      }
    },
    [searchParams, pathname, router],
  )

  return [parsedParams, setSearchParams] as const
}
