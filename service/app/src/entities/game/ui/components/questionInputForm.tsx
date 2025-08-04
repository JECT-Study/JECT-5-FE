"use client"

import {
  Control,
  Field,
  Label,
  Root,
} from "@shared/design/src/components/input"

import { useGameCreationContext } from "../../model/state/create/gameCreationContext"
import {
  validateAnswerText,
  validateQuestionText,
} from "../../model/state/create/selectors"

export function QuestionInputForm() {
  const { actions, selectors } = useGameCreationContext()
  const selectedQuestion = selectors.selectedQuestion

  const handleQuestionChange = (value: string) => {
    if (selectedQuestion) {
      actions.updateQuestion(selectedQuestion.id, { text: value })
    }
  }

  const handleAnswerChange = (value: string) => {
    if (selectedQuestion) {
      actions.updateQuestion(selectedQuestion.id, { answer: value })
    }
  }

  const questionError = validateQuestionText(selectedQuestion?.text || "")
  const answerError = validateAnswerText(selectedQuestion?.answer || "")

  return (
    <div className="flex w-[420px] flex-col gap-[54px]">
      <Root>
        <Field
          state={questionError ? "error" : "default"}
          type="labelOn"
          name="question"
          className="w-full"
        >
          <Label>질문*</Label>
          <Control
            placeholder="질문 입력"
            value={selectedQuestion?.text || ""}
            onChange={handleQuestionChange}
          />
        </Field>
      </Root>

      <Root>
        <Field
          state={answerError ? "error" : "default"}
          type="labelOn"
          name="answer"
          className="w-full"
        >
          <Label>답안*</Label>
          <Control
            placeholder="답안 입력"
            value={selectedQuestion?.answer || ""}
            onChange={handleAnswerChange}
          />
        </Field>
      </Root>
    </div>
  )
}
