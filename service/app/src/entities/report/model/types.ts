export interface ReportedGame {
  id: string
  no: number | string
  title: string
  creatorName: string
  reporterName: string
  reportedAt: string
  statusLabel: string
}

export interface AdminReportsResponse {
  report: AdminReport[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}

export interface AdminReport {
  reportId: number
  gameName: string
  creatorName: string
  reporterName: string
  reportedAt: string
  status: "PENDING" | "RESOLVED" | "REJECTED"
}
