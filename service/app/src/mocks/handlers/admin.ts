import { http, HttpResponse } from "msw"

import type {
  AdminReport,
  AdminReportsResponse,
  AdminUser,
  AdminUsersResponse,
} from "@/entities/report/model/types"
import {
  adminReportUpdateRequestSchema,
  reportIdParamsSchema,
} from "@/entities/report/model/types"
import {
  blockUsersRequestSchema,
  unblockUsersRequestSchema,
} from "@/entities/suspension/model/types"

import { internalServerError, loginRequiredError } from "../data/common"
import {
  gameMissingFieldsError,
  gameSuccessResponse,
  reportNotFoundError,
} from "../data/game"
import { validateSessionCookie } from "../utils/gameHandlers"
import { generateMockQuestions } from "../utils/mockGenerators"
import { generateSuccessResponse } from "../utils/responseHelpers"

const MSW_BASE_URL = process.env.MSW_BASE_URL || "http://localhost:3000"

const PAGE_SIZE = 7

const BLOCK_REASONS = [
  "VIOLENT_OR_DISTURBING_CONTENT",
  "SEXUAL_CONTENT",
  "CYBERBULLYING_OR_HARASSMENT",
  "SUICIDE_OR_SELF_HARM",
  "FRAUD_OR_MISINFORMATION",
  "SPAM_OR_PROMOTION",
  "PRIVACY_VIOLATION",
  "INTELLECTUAL_PROPERTY_INFRINGEMENT",
] as const

const generateMockUsers = (count: number): AdminUser[] => {
  return Array.from({ length: count }, (_, i) => {
    const blocked = i % 3 === 0
    return {
      nickname: `user_${i + 1}`,
      email: `user${i + 1}@example.com`,
      blockReason: blocked ? BLOCK_REASONS[i % BLOCK_REASONS.length] : null,
      blockedAt: blocked
        ? `2026-01-${String((i % 28) + 1).padStart(2, "0")}`
        : null,
      blocked,
    }
  })
}

export const createAdminHandlers = (initialReports: AdminReport[]) => {
  const store: AdminReport[] = structuredClone(initialReports)
  const usersStore: AdminUser[] = generateMockUsers(32)
  const blockedEmails = new Set<string>()

  return [
    http.get(`${MSW_BASE_URL}/admin/games`, ({ request }) => {
      try {
        const cookieHeader = request.headers.get("Cookie")
        if (!validateSessionCookie(cookieHeader)) {
          return HttpResponse.json(loginRequiredError, { status: 401 })
        }

        const url = new URL(request.url)
        const pageParam = url.searchParams.get("page")
        const page = pageParam ? Math.max(0, parseInt(pageParam, 10)) : 0

        const totalElements = store.length
        const totalPages = Math.ceil(totalElements / PAGE_SIZE)

        const startIndex = page * PAGE_SIZE
        const endIndex = startIndex + PAGE_SIZE

        const paginatedReports = store.slice(startIndex, endIndex)
        const hasNext = page < totalPages - 1

        const response: AdminReportsResponse = {
          content: paginatedReports,
          page,
          size: PAGE_SIZE,
          totalElements,
          totalPages,
          hasNext,
        }

        return HttpResponse.json(generateSuccessResponse(response))
      } catch {
        return HttpResponse.json(internalServerError, { status: 500 })
      }
    }),

    http.get(`${MSW_BASE_URL}/admin/games/:reportId`, ({ request, params }) => {
      try {
        const cookieHeader = request.headers.get("Cookie")
        if (!validateSessionCookie(cookieHeader)) {
          return HttpResponse.json(loginRequiredError, { status: 401 })
        }

        const parsed = reportIdParamsSchema.safeParse(params)
        if (!parsed.success) {
          return HttpResponse.json(gameMissingFieldsError(), { status: 400 })
        }

        const { reportId } = parsed.data
        const report = store.find((r) => r.reportId === reportId)

        if (!report) {
          return HttpResponse.json(reportNotFoundError(reportId), {
            status: 404,
          })
        }

        const makerNickname = report.creatorName
        const makerEmail = `${makerNickname
          .replace(/\s+/g, ".")
          .toLowerCase()}@example.com`

        const reporterNickname = report.reporterName
        const reporterEmail = `${reporterNickname
          .replace(/\s+/g, ".")
          .toLowerCase()}@example.com`

        const questionCount = 10
        const questions = generateMockQuestions(questionCount, 1)

        const data = {
          gameTitle: report.gameName,
          status: report.status,
          makerNickname,
          makerEmail,
          questionCount,
          version: 1,
          questions,
          reporterEmail,
          reporterNickname,
          reasonCode: "VIOLENT_OR_DISTURBING_CONTENT",
          isMakerBlock: blockedEmails.has(makerEmail),
          isReporterBlock: blockedEmails.has(reporterEmail),
        }

        return HttpResponse.json(generateSuccessResponse(data))
      } catch {
        return HttpResponse.json(internalServerError, { status: 500 })
      }
    }),

    http.post(`${MSW_BASE_URL}/admin/games/delete`, async ({ request }) => {
      try {
        const cookieHeader = request.headers.get("Cookie")
        if (!validateSessionCookie(cookieHeader)) {
          return HttpResponse.json(loginRequiredError, { status: 401 })
        }

        const json = await request.json()
        const parsed = adminReportUpdateRequestSchema.safeParse(json)

        if (!parsed.success) {
          return HttpResponse.json(gameMissingFieldsError(), { status: 400 })
        }

        const { reportId, status } = parsed.data

        const idx = store.findIndex((r) => r.reportId === reportId)

        if (idx === -1) {
          return HttpResponse.json(reportNotFoundError(reportId), {
            status: 404,
          })
        }

        const nextStatus = status === "DELETE_GAME" ? "GAME_DELETED" : "IGNORED"

        store[idx] = {
          ...store[idx],
          status: nextStatus,
        }

        return HttpResponse.json(gameSuccessResponse())
      } catch {
        return HttpResponse.json(internalServerError, { status: 500 })
      }
    }),

    http.post(`${MSW_BASE_URL}/admin/users/block`, async ({ request }) => {
      try {
        const cookieHeader = request.headers.get("Cookie")
        if (!validateSessionCookie(cookieHeader)) {
          return HttpResponse.json(loginRequiredError, { status: 401 })
        }

        const json = await request.json()
        const parsed = blockUsersRequestSchema.safeParse(json)

        if (!parsed.success) {
          return HttpResponse.json(gameMissingFieldsError(), { status: 400 })
        }

        parsed.data.banList.forEach(({ email, reason }) => {
          blockedEmails.add(email)
          const userIndex = usersStore.findIndex((u) => u.email === email)
          if (userIndex !== -1) {
            usersStore[userIndex] = {
              ...usersStore[userIndex],
              blocked: true,
              blockReason:
                (reason as (typeof BLOCK_REASONS)[number]) ||
                "VIOLENT_OR_DISTURBING_CONTENT",
              blockedAt: new Date().toISOString().split("T")[0],
            }
          }
        })

        return HttpResponse.json(gameSuccessResponse())
      } catch {
        return HttpResponse.json(internalServerError, { status: 500 })
      }
    }),

    http.post(`${MSW_BASE_URL}/admin/users/unblock`, async ({ request }) => {
      try {
        const cookieHeader = request.headers.get("Cookie")
        if (!validateSessionCookie(cookieHeader)) {
          return HttpResponse.json(loginRequiredError, { status: 401 })
        }

        const json = await request.json()
        const parsed = unblockUsersRequestSchema.safeParse(json)

        if (!parsed.success) {
          return HttpResponse.json(gameMissingFieldsError(), { status: 400 })
        }

        parsed.data.emails.forEach((email) => {
          blockedEmails.delete(email)
          const userIndex = usersStore.findIndex((u) => u.email === email)
          if (userIndex !== -1) {
            usersStore[userIndex] = {
              ...usersStore[userIndex],
              blocked: false,
              blockReason: null,
              blockedAt: null,
            }
          }
        })

        return HttpResponse.json(gameSuccessResponse())
      } catch {
        return HttpResponse.json(internalServerError, { status: 500 })
      }
    }),

    http.get(`${MSW_BASE_URL}/admin/users`, ({ request }) => {
      try {
        const cookieHeader = request.headers.get("Cookie")
        if (!validateSessionCookie(cookieHeader)) {
          return HttpResponse.json(loginRequiredError, { status: 401 })
        }

        const url = new URL(request.url)
        const pageParam = url.searchParams.get("page")
        const page = pageParam ? Math.max(0, parseInt(pageParam, 10)) : 0

        const totalElements = usersStore.length
        const totalPages = Math.ceil(totalElements / PAGE_SIZE)

        const startIndex = page * PAGE_SIZE
        const endIndex = startIndex + PAGE_SIZE

        const paginatedUsers = usersStore.slice(startIndex, endIndex)
        const hasNext = page < totalPages - 1

        const response: AdminUsersResponse = {
          content: paginatedUsers,
          page,
          size: PAGE_SIZE,
          totalElements,
          totalPages,
          hasNext,
        }

        return HttpResponse.json(generateSuccessResponse(response))
      } catch {
        return HttpResponse.json(internalServerError, { status: 500 })
      }
    }),
  ]
}
