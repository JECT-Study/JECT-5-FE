"use client"

import { PrimaryBoxButton } from "@ject-5-fe/design/components/button"
import { StickyActionBar } from "@ject-5-fe/design/components/stickyActionBar"
import { useRef } from "react"
import { useShallow } from "zustand/react/shallow"

import { useCreateGameStore } from "../store/useCreateGameStore"
import { Question } from "./question"

export function QuestionList() {
  const listBoxRef = useRef<HTMLDivElement>(null)
  const {
    questions,
    selectedQuestionId,
    setSelectedQuestionId,
    deleteQuestion,
    moveQuestion,
    addQuestion,
  } = useCreateGameStore(
    useShallow((state) => ({
      questions: state.questions,
      selectedQuestionId: state.selectedQuestionId,
      setSelectedQuestionId: state.setSelectedQuestionId,
      deleteQuestion: state.deleteQuestion,
      moveQuestion: state.moveQuestion,
      addQuestion: state.addQuestion,
    })),
  )

  return (
    <div className="flex h-full min-h-0 w-[420px] flex-col bg-background-tertiary px-[32px] py-[16px]">
      <div
        ref={listBoxRef}
        className="flex flex-col gap-24 overflow-y-auto"
        role="listbox"
        aria-label="문제 목록"
        tabIndex={0}
        onFocus={(e) => {
          if (e.target !== e.currentTarget) return
          const selectedOption =
            listBoxRef.current?.querySelector<HTMLElement>(
              '[aria-selected="true"]',
            ) ??
            listBoxRef.current?.querySelector<HTMLElement>('[role="option"]')
          selectedOption?.focus()
        }}
      >
        {questions.map((question, index) => {
          const isSelected = selectedQuestionId === question.id
          const questionError =
            question.text.length > 50 || question.text.length < 1
          const imageSrc = question.imageUrl || question.previewImageUrl || null

          return (
            <Question
              key={question.id}
              index={index + 1}
              isSelected={isSelected}
              hasError={questionError}
              onClick={() => setSelectedQuestionId(question.id)}
              title={question.text || "질문을 입력해주세요"}
              imageSrc={imageSrc}
              actions={{
                canDelete: questions.length > 1,
                onDelete: () => deleteQuestion(question.id),
                onMoveUp: () => moveQuestion(question.id, "up"),
                onMoveDown: () => moveQuestion(question.id, "down"),
              }}
            />
          )
        })}
      </div>

      <StickyActionBar
        position="sticky"
        edge="bottom"
        className="mt-auto px-[32px] pb-[16px]"
        contentClassName="w-full"
      >
        <PrimaryBoxButton size="xl" onClick={addQuestion} className="w-full">
          문제 추가하기
        </PrimaryBoxButton>
      </StickyActionBar>
    </div>
  )
}
