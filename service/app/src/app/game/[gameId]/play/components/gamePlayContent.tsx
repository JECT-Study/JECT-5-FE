import {
  PrimaryBoxButton,
  SecondaryOutlineBoxButton,
} from "@ject-5-fe/design/components/button"
import Image from "next/image"
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
      <h1 className="typography-heading-4xl-bold max-w-[1080px] text-center text-text-primary">
        {currentQuestion.questionText}
      </h1>

      {currentQuestion?.imageUrl && (
        <div className="relative max-h-[40vh] w-full overflow-hidden rounded-[10px]">
          <Image
            src={currentQuestion.imageUrl}
            alt="문제 이미지"
            className="h-auto max-h-[40vh] w-full rounded-[10px] object-contain transition-opacity duration-300"
            width={727}
            height={459}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzI3IiBoZWlnaHQ9IjQ1OSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
            loading="eager"
            sizes="(max-width: 1920px) 727px, 1454px"
          />
        </div>
      )}

      <div className="flex items-center justify-center gap-6">
        <QuestionNavigationButton
          direction="prev"
          onClick={onPrevQuestion}
          disabled={currentRound <= 1}
        />

        {showAnswer ? (
          <SecondaryOutlineBoxButton
            size="lg"
            onClick={() => setShowAnswer(false)}
          >
            {currentQuestion?.questionAnswer}
          </SecondaryOutlineBoxButton>
        ) : (
          <PrimaryBoxButton
            size="2xl"
            _style="solid"
            onClick={() => setShowAnswer(true)}
          >
            정답 보기
          </PrimaryBoxButton>
        )}

        <QuestionNavigationButton
          direction="next"
          onClick={onNextQuestion}
          disabled={currentRound >= totalRounds}
        />
      </div>
    </div>
  )
}
