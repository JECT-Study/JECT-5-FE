import { PrimaryBoxButton } from "@ject-5-fe/design/components/button"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"

import type { GameQuestion } from "@/entities/game/model"
interface GamePlayContentProps {
  currentQuestion: GameQuestion
  currentRound: number
  showAnswer: boolean
  onShowAnswer: () => void
  onPrevQuestion: () => void
  onNextQuestion: () => void
}

export const GamePlayContent = ({
  currentQuestion,
  currentRound,
  showAnswer,
  onShowAnswer,
  onPrevQuestion,
  onNextQuestion,
}: GamePlayContentProps) => {
  const [imageWidths, setImageWidths] = useState<Record<number, number>>({})
  const currentImageWidth = imageWidths[currentRound] ?? null

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "ArrowRight") {
        if (showAnswer) {
          onNextQuestion()
        } else {
          onShowAnswer()
        }
      }

      if (e.key === "ArrowLeft" && currentRound > 1) {
        onPrevQuestion()
      }
    },
    [showAnswer, currentRound, onNextQuestion, onPrevQuestion, onShowAnswer],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[70px] sm:max-w-[642px] md:max-w-[1080px]">
      <div className="flex flex-col items-center gap-40">
        <h1 className="text-center text-text-primary sm:typography-heading-3xl-extrabold md:typography-heading-4xl-extrabold">
          {currentQuestion.questionText}
        </h1>

        {currentQuestion?.imageUrl && (
          <div
            className="flex h-[246px] items-center justify-center overflow-hidden rounded-lg sm:h-[406px] md:h-[499px]"
            style={currentImageWidth ? { width: currentImageWidth } : undefined}
          >
            {showAnswer ? (
              <div className="flex size-full items-center justify-center rounded-12 border-2 border-border-interactive-secondary bg-background-interactive-inverse px-32 py-12 text-text-interactive-secondary sm:typography-heading-3xl-semibold md:typography-heading-4xl-semibold">
                {currentQuestion?.questionAnswer}
              </div>
            ) : (
              <Image
                src={currentQuestion.imageUrl}
                alt="문제 이미지"
                width={0}
                height={0}
                sizes="100vw"
                className="h-full w-auto"
                onLoad={(e) => {
                  const img = e.currentTarget
                  setImageWidths((prev) => ({
                    ...prev,
                    [currentRound]: img.offsetWidth,
                  }))
                }}
              />
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-16">
        <PrimaryBoxButton
          size="2xl"
          _style="solid"
          onClick={() => (showAnswer ? onNextQuestion() : onShowAnswer())}
        >
          {showAnswer ? "다음" : "정답은?"}
        </PrimaryBoxButton>
      </div>
    </div>
  )
}
