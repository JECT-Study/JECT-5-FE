"use client"

import * as TextField from "@ject-5-fe/design/components/textField"
import { useShallow } from "zustand/react/shallow"

import { useCreateGameStore } from "../store/useCreateGameStore"

export function QuestionInputForm() {
  const { selectedQuestionId, updateQuestion } = useCreateGameStore(
    useShallow((state) => ({
      selectedQuestionId: state.selectedQuestionId,
      updateQuestion: state.updateQuestion,
    })),
  )

  const selectedQuestion = useCreateGameStore(
    useShallow((state) =>
      state.questions.find((q) => q.id === selectedQuestionId),
    ),
  )

  const questionText = selectedQuestion?.text ?? ""
  const answerText = selectedQuestion?.answer ?? ""
  const questionError = questionText.length > 50 || questionText.length < 1
  const answerError = answerText.length > 50 || answerText.length < 1

  const handleQuestionChange = (value: string) => {
    updateQuestion(selectedQuestionId, { text: value })
  }

  const handleAnswerChange = (value: string) => {
    updateQuestion(selectedQuestionId, { answer: value })
  }

  return (
    <div className="flex w-[420px] flex-col gap-56">
      <TextField.Root
        name="question"
        state={questionError ? "error" : "default"}
        className="w-full"
      >
        <TextField.Label>질문*</TextField.Label>
        <TextField.InputWrapper>
          <TextField.Input
            placeholder="질문 입력"
            value={questionText}
            onChange={(e) => handleQuestionChange(e.target.value)}
          />
        </TextField.InputWrapper>
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
            value={answerText}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        </TextField.InputWrapper>
      </TextField.Root>
    </div>
  )
}
