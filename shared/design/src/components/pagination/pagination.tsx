import { type ComponentPropsWithoutRef } from "react"
import { forwardRef } from "react"

import { Arrow } from "../../icons"
import { cn } from "../../utils/cn"
import { SecondaryPlainBoxButton, SecondaryPlainIconButton } from "../button"

export interface PaginationProps extends ComponentPropsWithoutRef<"nav"> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisible?: number
}

interface PaginationItemProps {
  page: number
  isActive: boolean
  onClick: () => void
}

const PaginationItem = ({ page, isActive, onClick }: PaginationItemProps) => {
  return (
    <SecondaryPlainBoxButton
      onClick={onClick}
      className={cn(
        isActive && "rounded-12 bg-background-primary",
        "typography-heading-sm-semibold h-full bg-transparent p-16",
      )}
      aria-label={`페이지 ${page}로 이동`}
      aria-current={isActive ? "page" : undefined}
    >
      {page}
    </SecondaryPlainBoxButton>
  )
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      maxVisible = 5,
      className,
      ...rest
    },
    ref,
  ) => {
    const handlePrev = () => {
      if (currentPage > 1) {
        onPageChange(currentPage - 1)
      }
    }

    const handleNext = () => {
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1)
      }
    }

    const handlePageClick = (page: number) => {
      if (page !== currentPage) {
        onPageChange(page)
      }
    }

    const getVisiblePages = () => {
      const pages: number[] = []
      const half = Math.floor(maxVisible / 2)

      let start = Math.max(1, currentPage - half)
      const end = Math.min(totalPages, start + maxVisible - 1)

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      return pages
    }

    const visiblePages = getVisiblePages()
    const isPrevDisabled = currentPage <= 1
    const isNextDisabled = currentPage >= totalPages

    return (
      <nav
        ref={ref}
        aria-label="페이지네이션"
        className={cn("inline-flex items-center gap-8", className)}
        {...rest}
      >
        <SecondaryPlainIconButton
          onClick={handlePrev}
          disabled={isPrevDisabled}
          aria-label="이전 페이지"
          className="size-[48px]"
        >
          <Arrow className="-rotate-90" size={24} />
        </SecondaryPlainIconButton>

        <div className="flex items-center">
          {visiblePages.map((page) => (
            <PaginationItem
              key={page}
              page={page}
              isActive={page === currentPage}
              onClick={() => handlePageClick(page)}
            />
          ))}
        </div>

        <SecondaryPlainIconButton
          onClick={handleNext}
          disabled={isNextDisabled}
          aria-label="다음 페이지"
          size="md"
          className="size-[48px]"
        >
          <Arrow className="rotate-90" size={24} />
        </SecondaryPlainIconButton>
      </nav>
    )
  },
)

Pagination.displayName = "Pagination"
