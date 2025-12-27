import {
  DestructiveSolidIconButton,
  SecondaryPlainIconButton,
} from "@ject-5-fe/design/components/button"
import { Arrow, Trash } from "@ject-5-fe/design/icons"
import { cn } from "@ject-5-fe/design/utils/cn"
import Image from "next/image"

export interface QuestionProps {
  index: number
  isSelected?: boolean
  hasError?: boolean
  title: string
  imageSrc?: string | null
  onClick?: () => void
  actions?: {
    canDelete?: boolean
    onDelete?: () => void
    onMoveUp?: () => void
    onMoveDown?: () => void
  }
  className?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void
}

export const Question = ({
  index,
  isSelected = false,
  hasError = false,
  title,
  imageSrc,
  onClick,
  actions,
  className,
  onKeyDown,
}: QuestionProps) => {
  const canDelete = actions?.canDelete ?? true
  const shouldClampTitle = !hasError

  return (
    <div
      role="option"
      aria-label={`${index}번째 문제`}
      aria-selected={isSelected}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      onClick={() => onClick?.()}
      className={cn(
        "flex min-h-[134px] w-full min-w-0 justify-between gap-16 rounded-8 bg-background-primary px-20 py-24",
        onClick ? "cursor-pointer" : "cursor-default",
        hasError && "ring-2 ring-inset ring-border-interactive-input-error",
        !hasError &&
          isSelected &&
          "ring-2 ring-inset ring-border-interactive-primary",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">
        <h3
          className={cn(
            "typography-heading-sm-medium w-full min-w-0 break-keep text-text-primary",
            shouldClampTitle && "line-clamp-1 overflow-hidden text-ellipsis",
          )}
        >
          {hasError ? <>❗ {title}</> : title}
        </h3>

        <DestructiveSolidIconButton
          onClick={(e) => {
            e.stopPropagation()
            actions?.onDelete?.()
          }}
          disabled={!canDelete}
          aria-label={`${index}번째 문제 삭제`}
          size="md"
        >
          <Trash />
        </DestructiveSolidIconButton>
      </div>

      <div className="flex shrink-0 items-start gap-12">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt="질문 이미지"
            width={78}
            height={78}
            className="rounded-8 object-cover"
          />
        ) : null}

        <div className="flex flex-col items-center justify-between self-stretch">
          <SecondaryPlainIconButton
            onClick={(e) => {
              e.stopPropagation()
              actions?.onMoveUp?.()
            }}
            aria-label={`${index}번째 문제 위로 이동`}
          >
            <Arrow />
          </SecondaryPlainIconButton>

          <SecondaryPlainIconButton
            onClick={(e) => {
              e.stopPropagation()
              actions?.onMoveDown?.()
            }}
            aria-label={`${index}번째 문제 아래로 이동`}
          >
            <Arrow className="rotate-180" />
          </SecondaryPlainIconButton>
        </div>
      </div>
    </div>
  )
}
