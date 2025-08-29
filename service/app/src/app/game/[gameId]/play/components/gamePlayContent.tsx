import {
  PrimaryBoxButton,
  SecondaryOutlineBoxButton,
} from "@ject-5-fe/design/components/button"
import Image from "next/image"
import { useState } from "react"

import type { GameQuestion } from "@/entities/game/model"

interface GamePlayContentProps {
  currentQuestion: GameQuestion
}

export const GamePlayContent = ({ currentQuestion }: GamePlayContentProps) => {
  const [showAnswer, setShowAnswer] = useState(false)
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center">
      <h1
        className="typography-heading-4xl-bold mb-[118px] max-w-[1080px] text-center text-text-primary"
        id="special"
      >
        {currentQuestion.questionText}
      </h1>

      {currentQuestion?.imageUrl && (
        <div className="relative mb-[85px] min-h-[459px] w-[727px] overflow-hidden rounded-[10px]">
          <Image
            src={currentQuestion.imageUrl}
            alt="문제 이미지"
            className="size-full rounded-[10px] object-contain transition-opacity duration-300"
            fill
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzI3IiBoZWlnaHQ9IjQ1OSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
            loading="eager"
            sizes="(max-width: 1920px) 727px, 1454px"
          />
        </div>
      )}

      {showAnswer ? (
        <SecondaryOutlineBoxButton
          size="lg"
          onClick={() => setShowAnswer(false)}
          aria-label="wefwefwef"
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
    </div>
  )
}
