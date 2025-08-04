"use client"

import { Question } from "@shared/design/src/components/question"

import { validateQuestion } from "../../model"
import { useGameCreationContext } from "../../model/state/create/gameCreationContext"

export function QuestionList() {
  const { state, actions, getQuestionSelectors } = useGameCreationContext()

  return (
    <div className="flex w-[400px] flex-col items-center bg-gray-50 p-[25px_25px_0_25px]">
      <div className="flex w-[350px] flex-col items-start gap-6">
        {state.questions.map((question) => {
          const questionSelectors = getQuestionSelectors(question.id)
          const isSelected = questionSelectors.isSelected

          return (
            <Question
              key={question.id}
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
          )
        })}
      </div>
    </div>
  )
}
