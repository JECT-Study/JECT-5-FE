"use client"

import { Pagination } from "@ject-5-fe/design/components/pagination"
import { useState } from "react"

import { useAdminReports } from "@/entities/report/hooks/useAdminReports"
import { ReportedGamesTable } from "@/widgets/admin/reported-games-table"

export default function AdminReportsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const pageIndex = currentPage - 1

  const { games, totalPages } = useAdminReports({
    page: pageIndex,
  })

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="mt-[90px] flex w-full flex-col items-center gap-52 bg-background-interactive-primary-disabled p-40">
      <div className="flex size-full flex-col items-start gap-52 rounded-20 bg-background-interactive-primary-sub px-[62px] py-[70px]">
        <h1 className="typography-heading-2xl-extrabold">신고접수</h1>
        <ReportedGamesTable items={games} />
      </div>

      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}
