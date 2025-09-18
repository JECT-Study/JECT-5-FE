"use client"

import * as TextField from "@ject-5-fe/design/components/textField"

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
      <TextField.Root
        name="question"
        state={questionError ? "error" : "default"}
        className="w-full"
      >
        <TextField.Label>질문*</TextField.Label>
        <TextField.InputWrapper>
          <TextField.Input
            placeholder="질문 입력"
            value={selectedQuestion?.text || ""}
            onChange={(e) => handleQuestionChange(e.target.value)}
          />
        </TextField.InputWrapper>
        {questionError && (
          <TextField.ErrorText>{questionError}</TextField.ErrorText>
        )}
      </TextField.Root>

      <TextField.Root
        name="answer"
        state={answerError ? "error" : "default"}
        className="w-full"
      >
        <TextField.Label>답안*</TextField.Label>
        <TextField.InputWrapper>
          <TextField.Input
            placeholder="답안 입력"
            value={selectedQuestion?.answer || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        </TextField.InputWrapper>
        {answerError && (
          <TextField.ErrorText>{answerError}</TextField.ErrorText>
        )}
      </TextField.Root>
    </div>
  )
}
