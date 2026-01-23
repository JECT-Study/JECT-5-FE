"use client"

import { PrimaryBoxButton } from "@ject-5-fe/design/components/button"

interface GamePreviewReportTableProps {
  creator: { name: string; email: string; isBlocked: boolean }
  reporter: { name: string; email: string; isBlocked: boolean }
  category: string
  onBlockCreator?: () => void
  onBlockReporter?: () => void
}

export const GamePreviewReportTable = ({
  creator,
  reporter,
  category,
  onBlockCreator,
  onBlockReporter,
}: GamePreviewReportTableProps) => {
  return (
    <div
      className="flex w-full flex-col"
      role="table"
      aria-label="게임 신고 정보 테이블"
    >
      <div className="flex w-full items-center rounded-t-12 border border-border-interactive-tertiary">
        <div
          className="flex h-[70px] w-[174px] shrink-0 items-center justify-center rounded-tl-12 bg-background-interactive-secondary-pressed"
          role="rowheader"
        >
          <span className="typography-heading-md-semibold text-text-secondary">
            제작자
          </span>
        </div>
        <div
          className="flex h-[70px] w-full flex-1 items-center justify-between gap-[40px] px-[20px]"
          role="cell"
          aria-label="제작자 이름과 이메일"
        >
          <span className="typography-heading-md-medium text-text-interactive-input-filled">
            {creator.name}({creator.email})
          </span>
          <PrimaryBoxButton
            size="md"
            _style="solid"
            onClick={onBlockCreator}
            className="h-[44px] w-[83px] bg-background-interactive-destructive"
            aria-label={`제작자 ${creator.name} 차단`}
            disabled={creator.isBlocked}
          >
            차단
          </PrimaryBoxButton>
        </div>
      </div>

      <div className="flex w-full items-center border-b border-r border-border-interactive-tertiary">
        <div
          className="flex h-[70px] w-[174px] shrink-0 items-center justify-center bg-background-interactive-secondary-pressed"
          role="rowheader"
        >
          <span className="typography-heading-md-semibold text-text-secondary">
            신고자
          </span>
        </div>
        <div
          className="flex h-[70px] w-full flex-1 items-center justify-between gap-[40px] px-[20px]"
          role="cell"
          aria-label="신고자 이름과 이메일"
        >
          <span className="typography-heading-md-medium text-text-interactive-input-filled">
            {reporter.name}({reporter.email})
          </span>
          <PrimaryBoxButton
            size="md"
            _style="solid"
            onClick={onBlockReporter}
            className="h-[44px] w-[83px] bg-background-interactive-destructive"
            aria-label={`신고자 ${reporter.name} 차단`}
            disabled={reporter.isBlocked}
          >
            차단
          </PrimaryBoxButton>
        </div>
      </div>

      <div className="flex w-full items-center rounded-b-12 border-b border-r border-border-interactive-tertiary">
        <div
          className="flex h-[70px] w-[174px] shrink-0 items-center justify-center rounded-bl-12 bg-background-interactive-secondary-pressed"
          role="rowheader"
        >
          <span className="typography-heading-md-semibold text-text-secondary">
            항목
          </span>
        </div>
        <div
          className="flex h-[70px] flex-1 items-center px-[20px]"
          role="cell"
        >
          <span
            className="typography-heading-md-semibold text-text-interactive-input-error"
            aria-label="신고 사유"
          >
            {category}
          </span>
        </div>
      </div>
    </div>
  )
}
