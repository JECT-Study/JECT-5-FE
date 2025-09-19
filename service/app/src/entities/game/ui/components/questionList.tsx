"use client"

import { Question } from "@shared/design/src/components/question"
import * as TextField from "@shared/design/src/components/textField"
import Image from "next/image"

import { AddQuestionOverlay } from "@/app/create/components/addQuestionOverlay"

import { validateQuestion } from "../../model"
import { useGameCreationContext } from "../../model/state/create/gameCreationContext"
// import { selectors } from "../../model/state/create/selectors"

export function QuestionList() {
  const { state, actions, getQuestionSelectors } = useGameCreationContext()

  const handleAddQuestion = () => {
    actions.addQuestion()
  }

  const handleGameNameChange = (value: string) => {
    actions.setGameName(value)
  }

  const handleGameNameFocus = () => {
    actions.setGameNameFocus(true)
  }

  const handleGameNameBlur = () => {
    actions.setGameNameFocus(false)
  }

  return (
    <div
      className="relative flex h-screen min-w-[420px] flex-col items-center bg-background-tertiary px-32"
      role="list"
      aria-label="게임 문제 목록"
    >
      <div className="flex w-full py-20">
        <TextField.Root
          name="gameTitle"
          // state={selectors.gameNameError ? "error" : "default"}
        >
          <TextField.InputWrapper className="flex min-h-[23px] w-80 min-w-[288px] shrink-0 items-center gap-2 bg-background-interactive-input-primary p-12 px-16">
            <TextField.Input
              placeholder="게임 이름 입력"
              value={state.gameName}
              onChange={(e) => handleGameNameChange(e.target.value)}
              onFocus={handleGameNameFocus}
              onBlur={handleGameNameBlur}
            />
          </TextField.InputWrapper>
        </TextField.Root>
      </div>
      <div className="flex flex-col items-start gap-24 overflow-y-scroll pb-[173px]">
        {state.questions.map((question, index) => {
          const questionSelectors = getQuestionSelectors(question.id)
          const isSelected = questionSelectors.isSelected

          return (
            <div key={question.id}>
              <Question
                index={index + 1}
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

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <AddQuestionOverlay onAddQuestion={handleAddQuestion} />
      </div>
    </div>
  )
}
