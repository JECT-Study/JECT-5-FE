"use client"

import {
  Control,
  Field,
  Label,
  Root,
} from "@shared/design/src/components/input"

import { useGameCreationContext } from "../../model/state/create/gameCreationContext"

export function QuestionInputForm() {
  const { actions, selectors } = useGameCreationContext();
  const selectedQuestion = selectors.selectedQuestion;

  const handleQuestionChange = (value: string) => {
    if (selectedQuestion) {
      actions.updateQuestion(selectedQuestion.id, { text: value });
    }
  };

  const handleAnswerChange = (value: string) => {
    if (selectedQuestion) {
      actions.updateQuestion(selectedQuestion.id, { answer: value });
    }
  };

  return (
    <div className="flex w-[420px] flex-col gap-[54px]">
      <Root>
        <Field 
          type="labelOn" 
          state={selectedQuestion?.text ? "default" : "error"} 
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
          type="labelOn" 
          state={selectedQuestion?.answer ? "default" : "error"} 
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
