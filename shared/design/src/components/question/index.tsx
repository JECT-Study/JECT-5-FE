"use client"

import { type MouseEvent } from "react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

import { Arrow, Trash } from "../../icons"
import { DestructiveSolidIconButton, SecondaryPlainIconButton } from "../button"

type QuestionState = "default" | "selected" | "error"

interface QuestionContextType {
  state: QuestionState
  onClick?: () => void
  accessibilityTitle?: string
  setAccessibilityTitle: (title: string) => void
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
}

const QuestionRoot = ({
  state,
  onClick,
  children,
  className = "",
}: QuestionRootProps) => {
  const [accessibilityTitle, setAccessibilityTitleState] = useState<string>("")

  const setAccessibilityTitle = useCallback((title: string) => {
    setAccessibilityTitleState(title)
  }, [])
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

  const accessibleName = accessibilityTitle
    ? `질문: ${accessibilityTitle}`
    : "질문 카드"

  return (
    <QuestionContext.Provider
      value={{ state, onClick, accessibilityTitle, setAccessibilityTitle }}
    >
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
  const { state, setAccessibilityTitle } = useQuestionContext()

  useEffect(() => {
    if (typeof children === "string") {
      setAccessibilityTitle(children)
    }
  }, [children, setAccessibilityTitle])

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
  const { accessibilityTitle } = useQuestionContext()

  const deleteLabel = accessibilityTitle
    ? `${accessibilityTitle} 질문 삭제`
    : "질문 삭제"

  return (
    <div className={`absolute bottom-4 left-4 ${className}`}>
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
  const { accessibilityTitle } = useQuestionContext()

  const upLabel = accessibilityTitle
    ? `${accessibilityTitle} 질문 위로 이동`
    : "질문 위로 이동"
  const downLabel = accessibilityTitle
    ? `${accessibilityTitle} 질문 아래로 이동`
    : "질문 아래로 이동"

  return (
    <div
      className={`absolute right-4 top-5 flex flex-col items-center gap-5 ${className}`}
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
    <div className={`flex items-center gap-2 ${className}`}>{children}</div>
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
