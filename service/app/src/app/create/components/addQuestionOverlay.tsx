"use client"

import { PrimaryBoxButton } from "@shared/design/src/components/button"
import { Add } from "@shared/design/src/icons"

interface AddQuestionOverlayProps {
  onAddQuestion?: () => void
  className?: string
}

export const AddQuestionOverlay = ({
  onAddQuestion,
  className = "",
}: AddQuestionOverlayProps) => {
  return (
    <div
      className={`relative h-[173px] w-[420px] ${className}`}
      role="region"
      aria-label="문제 추가 영역"
    >
      <div
        className="size-full"
        style={{
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 43.05%)",
        }}
        aria-hidden="true"
      />

      <div className="absolute bottom-[26px] left-[35px]">
        <PrimaryBoxButton
          size="xl"
          _style="solid"
          onClick={onAddQuestion}
          className="w-[350px]"
        >
          <Add aria-hidden="true" />
          문제 추가하기
        </PrimaryBoxButton>
      </div>
    </div>
  )
}
