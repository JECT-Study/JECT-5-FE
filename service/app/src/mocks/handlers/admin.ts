import { http, HttpResponse } from "msw"

import { type AdminReportsResponse, mockAdminReports } from "../data/admin"
import { internalServerError, loginRequiredError } from "../data/common"
import { validateSessionCookie } from "../utils/gameHandlers"
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

      if (isNaN(page) || page < 0) {
        return HttpResponse.json(
          {
            result: "ERROR",
            data: null,
            error: {
              code: "E400",
              message: "Invalid page parameter",
            },
          },
          { status: 400 },
        )
      }

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
]
