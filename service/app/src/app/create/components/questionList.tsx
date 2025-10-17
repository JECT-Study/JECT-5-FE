"use client"

import { PrimaryBoxButton } from "@ject-5-fe/design/components/button"
import { Question } from "@ject-5-fe/design/components/question"
import { StickyActionBar } from "@ject-5-fe/design/components/stickyActionBar"
import Image from "next/image"
import { useShallow } from "zustand/react/shallow"

import { useCreateGameStore } from "../store/useCreateGameStore"

export function QuestionList() {
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
    <div
      className="flex h-full min-h-0 w-[420px] flex-col bg-background-tertiary"
      data-testid="question-list"
    >
      <div className="flex-1 overflow-y-auto px-[32px] py-[16px] pb-32">
        {questions.map((question, index) => {
          const isSelected = selectedQuestionId === question.id
          const questionError =
            question.text.length > 50 || question.text.length < 1

          return (
            <div key={question.id} className="mb-24 last:mb-0">
              <Question
                index={index + 1}
                state={
                  isSelected ? "selected" : questionError ? "error" : "default"
                }
                onClick={() => setSelectedQuestionId(question.id)}
              >
                <Question.Title>
                  {question.text || "질문을 입력해주세요"}
                </Question.Title>

                <Question.Image>
                  {(question.imageUrl || question.previewImageUrl) && (
                    <Image
                      src={question.imageUrl || question.previewImageUrl || ""}
                      alt="질문 이미지"
                      width={78}
                      height={78}
                      className="size-[78px] rounded-[7px] object-cover"
                    />
                  )}
                </Question.Image>

                <Question.DeleteButton
                  onDelete={() => deleteQuestion(question.id)}
                  canDelete={questions.length > 1}
                />

                <Question.MoveButtons
                  onMoveUp={() => moveQuestion(question.id, "up")}
                  onMoveDown={() => moveQuestion(question.id, "down")}
                />
              </Question>
            </div>
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
