"use client"

import { Pagination } from "@ject-5-fe/design/components/pagination"

export default function AdminReportsPage() {
  return (
    <div className="mt-[90px] flex w-full justify-center bg-background-interactive-primary-disabled">
      <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
    </div>
  )
}
