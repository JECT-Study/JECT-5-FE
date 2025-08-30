"use client"

import { Question } from "@shared/design/src/components/question"
import Image from "next/image"

import { validateQuestion } from "../../model"
import { useGameCreationContext } from "../../model/state/create/gameCreationContext"

export function QuestionList() {
  const { state, actions, getQuestionSelectors } = useGameCreationContext()

  return (
    <div
      className="flex w-[400px] flex-col items-center bg-background-tertiary p-[25px_25px_0_25px]"
      role="list"
      aria-label="게임 문제 목록"
    >
      <div className="flex w-[350px] flex-col items-start gap-6">
        {state.questions.map((question, index) => {
          const questionSelectors = getQuestionSelectors(question.id)
          const isSelected = questionSelectors.isSelected

          return (
            <div key={question.id} data-testid={`question-item-${index}`}>
              <Question
                state={
                  isSelected
                    ? "selected"
                    : !validateQuestion(question)
                      ? "error"
                      : "default"
                }
                onClick={() => actions.selectQuestion(question.id)}
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
                  onDelete={() => actions.deleteQuestion(question.id)}
                  canDelete={state.questions.length > 1}
                />

                <Question.MoveButtons
                  onMoveUp={() => actions.moveQuestion(question.id, "up")}
                  onMoveDown={() => actions.moveQuestion(question.id, "down")}
                />
              </Question>
            </div>
          )
        })}
      </div>
    </div>
  )
}
