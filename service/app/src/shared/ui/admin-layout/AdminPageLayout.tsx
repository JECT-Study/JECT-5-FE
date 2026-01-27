import { Pagination } from "@ject-5-fe/design/components/pagination"
import type { ReactNode } from "react"

interface AdminPageLayoutProps {
  header: ReactNode
  children: ReactNode
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const AdminPageLayout = ({
  header,
  children,
  currentPage,
  totalPages,
  onPageChange,
}: AdminPageLayoutProps) => {
  return (
    <div className="flex h-full min-h-0 flex-col items-center bg-background-interactive-primary-disabled p-40">
      <div className="flex size-full min-h-0 flex-col justify-between gap-52 rounded-20 bg-background-interactive-primary-sub px-[62px] pb-[34px] pt-60">
        <div className="flex min-h-0 w-full flex-col items-start gap-52 overflow-y-auto">
          {header}
          {children}
        </div>
        <div className="flex w-full justify-center">
          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>
    </div>
  )
}
