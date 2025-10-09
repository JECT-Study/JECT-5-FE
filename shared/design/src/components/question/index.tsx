"use client"

import { type MouseEvent } from "react"
import { createContext, useContext } from "react"

import { Arrow, Trash } from "../../icons"
import { DestructiveSolidIconButton, SecondaryPlainIconButton } from "../button"

type QuestionState = "default" | "selected" | "error"

interface QuestionContextType {
  state: QuestionState
  onClick?: () => void
  index?: number
}

const QuestionContext = createContext<QuestionContextType | null>(null)

const useQuestionContext = () => {
  const context = useContext(QuestionContext)
  if (!context) {
    throw new Error("Question compound components must be used within Question")
  }
  return context
}

// Root Question Component
interface QuestionRootProps {
  state: QuestionState
  onClick?: () => void
  children: React.ReactNode
  className?: string
  index?: number
}

const QuestionRoot = ({
  state,
  onClick,
  children,
  className = "",
  index,
}: QuestionRootProps) => {
  const getStateClasses = () => {
    switch (state) {
      case "selected":
        return "border-border-interactive-primary bg-background-primary"
      case "error":
        return "border-transparent"
      default:
        return "border-transparent"
    }
  }

  const accessibleName = index ? `${index}번째 문제` : "질문 카드"

  return (
    <QuestionContext.Provider value={{ state, onClick, index }}>
      <div
        role="group"
        aria-label={accessibleName}
        data-state={state}
        className={`relative h-[118px] w-[350px] shrink-0 cursor-pointer rounded-[10px] border-2 bg-background-primary p-5 ${getStateClasses()} ${className}`}
        onClick={onClick}
      >
        {children}
      </div>
    </QuestionContext.Provider>
  )
}

interface QuestionTitleProps {
  children: React.ReactNode
  className?: string
}

const QuestionTitle = ({ children, className = "" }: QuestionTitleProps) => {
  const { state } = useQuestionContext()

  return (
    <h3
      className={`typography-heading-sm-medium line-clamp-1 overflow-hidden text-ellipsis pr-[157px] pt-1 text-text-primary ${className}`}
    >
      {state === "error" ? <>❗ {children}</> : children}
    </h3>
  )
}

interface QuestionImageProps {
  children?: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

const QuestionImage = ({
  children,
  fallback,
  className = "",
}: QuestionImageProps) => {
  const defaultFallback = (
    <div className="flex size-[78px] items-center justify-center rounded-[7px] bg-background-tertiary">
      <img
        src="/checker.svg"
        alt="기본 이미지"
        className="size-[78px] rounded-[7px]"
      />
    </div>
  )

  return (
    <div className={`absolute right-14 top-5 ${className}`}>
      {children || fallback || defaultFallback}
    </div>
  )
}

// Delete Button Component
interface QuestionDeleteButtonProps {
  onDelete?: () => void
  canDelete?: boolean
  className?: string
}

const QuestionDeleteButton = ({
  onDelete,
  canDelete = true,
  className = "",
}: QuestionDeleteButtonProps) => {
  const { index } = useQuestionContext()

  const deleteLabel = index ? `${index}번째 문제 삭제` : "문제 삭제"

  return (
    <div className={`absolute bottom-[10px] left-[14px] ${className}`}>
      <DestructiveSolidIconButton
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation()
          onDelete?.()
        }}
        disabled={!canDelete}
        aria-label={deleteLabel}
        size="md"
      >
        <Trash />
      </DestructiveSolidIconButton>
    </div>
  )
}

// Move Buttons Component
interface QuestionMoveButtonsProps {
  onMoveUp?: () => void
  onMoveDown?: () => void
  className?: string
}

const QuestionMoveButtons = ({
  onMoveUp,
  onMoveDown,
  className = "",
}: QuestionMoveButtonsProps) => {
  const { index } = useQuestionContext()

  const upLabel = index ? `${index}번째 문제 위로 이동` : "문제 위로 이동"
  const downLabel = index ? `${index}번째 문제 아래로 이동` : "문제 아래로 이동"

  return (
    <div
      className={`absolute right-16 top-20 flex flex-col items-center gap-20 ${className}`}
    >
      <SecondaryPlainIconButton
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation()
          onMoveUp?.()
        }}
        size="md"
        aria-label={upLabel}
      >
        <Arrow />
      </SecondaryPlainIconButton>

      <SecondaryPlainIconButton
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation()
          onMoveDown?.()
        }}
        size="md"
        aria-label={downLabel}
      >
        <Arrow className="rotate-180" />
      </SecondaryPlainIconButton>
    </div>
  )
}

// Actions Container Component
interface QuestionActionsProps {
  children: React.ReactNode
  className?: string
}

const QuestionActions = ({
  children,
  className = "",
}: QuestionActionsProps) => {
  return (
    <div className={`flex items-center gap-8 ${className}`}>{children}</div>
  )
}

// Main Question component with all sub-components
export const Question = Object.assign(QuestionRoot, {
  Title: QuestionTitle,
  Image: QuestionImage,
  DeleteButton: QuestionDeleteButton,
  MoveButtons: QuestionMoveButtons,
  Actions: QuestionActions,
})
