import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

import type { GameQuestion } from "@/entities/game/model"

import { QuestionNavigationButton } from "./questionNavigationButton"

interface GamePlayContentProps {
  currentQuestion: GameQuestion
  currentRound: number
  totalRounds: number
  onPrevQuestion: () => void
  onNextQuestion: () => void
}

export const GamePlayContent = ({
  currentQuestion,
  currentRound,
  totalRounds,
  onPrevQuestion,
  onNextQuestion,
}: GamePlayContentProps) => {
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    setShowAnswer(false)
  }, [currentRound])

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-[68px]">
      <h1 className="typography-heading-4xl-extrabold max-w-[1080px] text-center text-text-primary">
        {currentQuestion.questionText}
      </h1>

      {currentQuestion?.imageUrl && (
        <div className="relative mx-auto w-[600px] overflow-hidden rounded-lg">
          <Image
            src={currentQuestion.imageUrl}
            alt="문제 이미지"
            width={600}
            height={400}
            className="object-cover"
          />
        </div>
      )}

      <div className="flex items-center justify-center gap-6">
        <QuestionNavigationButton
          direction="prev"
          onClick={onPrevQuestion}
          disabled={currentRound <= 1}
        />

        <div className="flex flex-col items-center gap-16">
          {showAnswer ? (
            <div
              onClick={() => setShowAnswer(false)}
              className="typography-heading-3xl-semibold inline-flex w-[572px] cursor-pointer flex-row items-center justify-center gap-12 rounded-12 border-[3px] border-border-interactive-secondary bg-background-interactive-inverse px-32 py-12 text-text-interactive-secondary hover:bg-background-interactive-secondary-hovered active:border-none active:bg-background-interactive-secondary-pressed"
            >
              {currentQuestion?.questionAnswer}
            </div>
          ) : (
            <div
              onClick={() => setShowAnswer(true)}
              className="typography-heading-3xl-semibold inline-flex w-[572px] cursor-pointer flex-row items-center justify-center gap-8 rounded-12 border-[3px] border-transparent bg-background-interactive-primary px-32 py-12 text-text-interactive-inverse hover:bg-background-interactive-primary-hovered active:border-transparent active:bg-background-interactive-primary-pressed"
            >
              정답 보기
            </div>
          )}

          {currentRound === totalRounds && (
            <Link
              href="./result"
              className="typography-heading-3xl-semibold inline-flex w-[572px] cursor-pointer flex-row items-center justify-center gap-8 rounded-12 border-[3px] border-transparent bg-background-secondary px-32 py-12 text-text-interactive-inverse hover:bg-background-interactive-primary-hovered active:border-transparent active:bg-background-interactive-primary-pressed"
            >
              결과 화면으로 이동하기
            </Link>
          )}
        </div>

        <QuestionNavigationButton
          direction="next"
          onClick={onNextQuestion}
          disabled={currentRound >= totalRounds}
        />
      </div>
    </div>
  )
}
