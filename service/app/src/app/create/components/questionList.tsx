"use client"

import { Question } from "@ject-5-fe/design/components/question"
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
  } = useCreateGameStore(
    useShallow((state) => ({
      questions: state.questions,
      selectedQuestionId: state.selectedQuestionId,
      setSelectedQuestionId: state.setSelectedQuestionId,
      deleteQuestion: state.deleteQuestion,
      moveQuestion: state.moveQuestion,
    })),
  )

  return (
    <div
      className="flex w-[420px] flex-col items-start overflow-y-auto bg-background-tertiary px-[32px] py-[16px]"
      data-testid="question-list"
    >
      {questions.map((question, index) => {
        const isSelected = selectedQuestionId === question.id
        const questionError =
          question.text.length > 50 || question.text.length < 1

        return (
          <div key={question.id}>
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
  )
}
