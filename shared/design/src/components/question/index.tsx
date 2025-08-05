"use client"

import { Arrow, Trash } from "../../icons"
import { DestructiveSolidIconButton, SecondaryPlainIconButton } from "../button"

type QuestionVariant = {
  state: "default" | "selected" | "error"
}

interface QuestionProps extends QuestionVariant {
  title: string
  image?: string | null
  canDelete?: boolean
  onClick?: () => void
  onDelete?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
}

export const Question = ({
  title,
  image,
  state,
  canDelete = true,
  onClick,
  onDelete,
  onMoveUp,
  onMoveDown,
}: QuestionProps) => {
  return (
    <div
      className={`relative h-[118px] w-[350px] shrink-0 cursor-pointer rounded-[10px] border-2 bg-background-primary p-5 ${
        state === "selected"
          ? "border-border-interactive-primary bg-background-primary"
          : "border-transparent"
      }`}
      onClick={onClick}
    >
      {/* Question Text */}
      <h3 className="typography-heading-sm-medium line-clamp-1 overflow-hidden text-ellipsis pr-[157px] pt-1 text-text-primary">
        {state === "error" ? "❗" : title}
      </h3>

      {/* Image - 오른쪽 */}
      <div className="absolute right-14 top-5">
        {image ? (
          <img 
            src={image} 
            alt="질문 이미지" 
            className="size-[78px] rounded-[7px] object-cover"
          />
        ) : (
          <div className="flex size-[78px] items-center justify-center rounded-[7px] bg-gray-200">
            <img 
              src="/checker.svg" 
              alt="기본 이미지"
              className="size-[78px] rounded-[7px]"
            />
          </div>
        )}
      </div>

      {/* Delete Button - 왼쪽 하단 */}
      <div className="absolute bottom-4 left-4">
        <DestructiveSolidIconButton
          onClick={onDelete}
          disabled={!canDelete}
          aria-label="질문 삭제"
          size="md"
        >
          <Trash />
        </DestructiveSolidIconButton>
      </div>

      {/* Move Buttons - 오른쪽 */}
      <div className="absolute right-4 top-5 flex flex-col items-center gap-5">
        <SecondaryPlainIconButton
          onClick={onMoveUp}
          size="md"
          aria-label="위로 이동"
        >
          <Arrow />
        </SecondaryPlainIconButton>

        <SecondaryPlainIconButton
          onClick={onMoveDown}
          size="md"
          aria-label="아래로 이동"
        >
          <Arrow className="rotate-180" />
        </SecondaryPlainIconButton>
      </div>
    </div>
  )
}
