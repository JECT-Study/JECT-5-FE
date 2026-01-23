import { http, HttpResponse } from "msw"

import type {
  AdminReport,
  AdminReportsResponse,
} from "@/entities/report/model/types"
import {
  adminReportUpdateRequestSchema,
  reportIdParamsSchema,
} from "@/entities/report/model/types"
import { blockUsersRequestSchema } from "@/entities/suspension/model/types"

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

export const createAdminHandlers = (initialReports: AdminReport[]) => {
  const store: AdminReport[] = structuredClone(initialReports)
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
          report: paginatedReports,
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

        parsed.data.banList.forEach(({ email }) => {
          blockedEmails.add(email)
        })

        return HttpResponse.json(gameSuccessResponse())
      } catch {
        return HttpResponse.json(internalServerError, { status: 500 })
      }
    }),
  ]
}
