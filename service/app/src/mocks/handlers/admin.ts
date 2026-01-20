import { http, HttpResponse } from "msw"

import { adminReportUpdateRequestSchema } from "@/entities/report/model/types"
import { blockUsersRequestSchema } from "@/entities/suspension/model/types"

import { type AdminReportsResponse, mockAdminReports } from "../data/admin"
import { internalServerError, loginRequiredError } from "../data/common"
import {
  gameMissingFieldsError,
  gameNotFoundError,
  gameSuccessResponse,
} from "../data/game"
import { validateSessionCookie } from "../utils/gameHandlers"
import { generateMockQuestions } from "../utils/mockGenerators"
import { generateSuccessResponse } from "../utils/responseHelpers"

const MSW_BASE_URL = process.env.MSW_BASE_URL || "http://localhost:3000"

const PAGE_SIZE = 7
const TOTAL_ELEMENTS = 21

export const adminHandlers = [
  http.get(`${MSW_BASE_URL}/admin/games`, ({ request }) => {
    try {
      const cookieHeader = request.headers.get("Cookie")
      if (!validateSessionCookie(cookieHeader)) {
        return HttpResponse.json(loginRequiredError, { status: 401 })
      }

      const url = new URL(request.url)
      const pageParam = url.searchParams.get("page")
      const page = pageParam ? Math.max(0, parseInt(pageParam, 10)) : 0

      const totalPages = Math.ceil(TOTAL_ELEMENTS / PAGE_SIZE)
      const startIndex = page * PAGE_SIZE
      const endIndex = startIndex + PAGE_SIZE

      const paginatedReports = mockAdminReports.slice(startIndex, endIndex)
      const hasNext = page < totalPages - 1

      const response: AdminReportsResponse = {
        report: paginatedReports,
        page,
        size: PAGE_SIZE,
        totalElements: TOTAL_ELEMENTS,
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

      const reportId = Number(params.reportId)

      const report = mockAdminReports.find((r) => r.reportId === reportId)
      if (!report) {
        return HttpResponse.json(gameNotFoundError(reportId.toString()), {
          status: 404,
        })
      }

      const makerNickname = report.creatorName
      const makerEmail = `${makerNickname.replace(/\s+/g, ".").toLowerCase()}@example.com`
      const reporterNickname = report.reporterName
      const reporterEmail = `${reporterNickname.replace(/\s+/g, ".").toLowerCase()}@example.com`

      const questionCount = 10
      const questions = generateMockQuestions(questionCount, 1)

      const data = {
        gameTitle: report.gameName,
        makerNickname,
        makerEmail,
        questionCount,
        version: 1,
        questions,
        reporterEmail,
        reporterNickname,
        reasonCode: "VIOLENT_OR_DISTURBING_CONTENT",
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

      const { reportId } = parsed.data

      const report = mockAdminReports.find((r) => r.reportId === reportId)
      if (!report) {
        return HttpResponse.json(gameNotFoundError(reportId.toString()), {
          status: 404,
        })
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

      return HttpResponse.json(gameSuccessResponse())
    } catch {
      return HttpResponse.json(internalServerError, { status: 500 })
    }
  }),
]
