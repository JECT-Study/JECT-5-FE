"use client"

import { Pagination } from "@ject-5-fe/design/components/pagination"
import { useState } from "react"

import { useAdminGamePreview } from "@/entities/game/hooks/useGameReportDetail"
import { useAdminReports } from "@/entities/report/hooks/useAdminReports"
import { ReportedGamesTable } from "@/widgets/admin/reported-games-table"

export default function AdminReportsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const pageIndex = currentPage - 1

  const { games, totalPages } = useAdminReports({
    page: pageIndex,
  })

  const { openAdminPreview } = useAdminGamePreview()

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRowClick = (item: (typeof games)[number]) => {
    openAdminPreview(item.id)
  }

  return (
    <div className="flex h-full flex-col items-center bg-background-interactive-primary-disabled p-40">
      <div className="flex size-full flex-col justify-between gap-52 rounded-20 bg-background-interactive-primary-sub px-[62px] pb-[34px] pt-60">
        <div className="flex w-full flex-col items-start gap-52 overflow-y-auto">
          <h1 className="typography-heading-2xl-extrabold shrink-0 text-text-secondary">
            신고접수
          </h1>
          <ReportedGamesTable items={games} onRowClick={handleRowClick} />
        </div>
        <div className="flex w-full justify-center">
          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  )
}
