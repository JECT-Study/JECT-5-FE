"use client"

import { Question } from "@shared/design/src/components/question"

import { validateQuestion } from "../../model"
import { useGameCreationContext } from "../../model/state/create/gameCreationContext"

export function QuestionList() {
  const { state, actions, getQuestionSelectors } = useGameCreationContext()

  return (
    <div 
      className="flex w-[400px] flex-col items-center bg-background-tertiary p-[25px_25px_0_25px]"
      role="list"
      aria-label="게임 문제 목록"
      data-testid="question-list"
    >
      <div className="flex w-[350px] flex-col items-start gap-6">
        {state.questions.map((question, index) => {
          const questionSelectors = getQuestionSelectors(question.id)
          const isSelected = questionSelectors.isSelected

          return (
            <div
              key={question.id}
              role="listitem"
              aria-label={`문제 ${index + 1}: ${question.text || "질문을 입력해주세요"}`}
              data-testid={`question-item-${index}`}
            >
              <Question
                title={question.text || "질문을 입력해주세요"}
                image={question.imageUrl || question.previewImageUrl}
                state={
                  isSelected
                    ? "selected"
                    : validateQuestion(question)
                      ? "default"
                      : "error"
                }
                canDelete={state.questions.length > 1}
                onClick={() => actions.selectQuestion(question.id)}
                onDelete={() => actions.deleteQuestion(question.id)}
                onMoveUp={() => actions.moveQuestion(question.id, "up")}
                onMoveDown={() => actions.moveQuestion(question.id, "down")}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
