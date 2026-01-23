import { adminReportFixtures } from "../fixtures/adminReports"
import { createAdminHandlers } from "./admin"
import { authHandlers } from "./auth"
import { gameHandlers } from "./game"

export const handlers = [
  ...authHandlers,
  ...gameHandlers,
  ...createAdminHandlers([
    adminReportFixtures.pending(1),
    adminReportFixtures.deleted(2),
    adminReportFixtures.pending(3),
    adminReportFixtures.pending(4),
    adminReportFixtures.pending(5),
    adminReportFixtures.pending(6),
    adminReportFixtures.pending(7),
  ]),
]
