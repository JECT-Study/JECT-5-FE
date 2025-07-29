"use client"

import { Control, Field, Label, Root } from "@shared/design/src/components/input"

export function QuestionInputForm() {
  return (
    <div className="w-[420px] flex flex-col gap-[54px]">
      <Root>
        <Field type="labelOn" state="default" name="question" className="w-full">
          <Label>질문*</Label>
          <Control placeholder="질문 입력" />
        </Field>
      </Root>

      <Root>
        <Field type="labelOn" state="default" name="answer" className="w-full">
          <Label>답안*</Label>
          <Control placeholder="답안 입력" />
        </Field>
      </Root>
    </div>
  )
} 