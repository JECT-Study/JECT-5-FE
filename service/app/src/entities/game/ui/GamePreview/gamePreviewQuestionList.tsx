"use client"

import * as GameCard from "@/entities/game/ui/GameCard/gameCard"

interface GamePreviewQuestionListProps {
  questions: Array<{
    id: number
    title: string
    imageUrl?: string
  }>
}

export const GamePreviewQuestionList = ({
  questions,
}: GamePreviewQuestionListProps) => {
  return (
    <div
      className="mt-20 flex w-full items-center gap-32 overflow-x-auto p-0"
      data-testid="game-preview-questions"
    >
      {questions.map((question) => (
        <GameCard.Root key={question.id}>
          <GameCard.Image
            className="h-[260px] w-[178px]"
            src={question.imageUrl ?? "/thumbnail.svg"}
            alt={question.title}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzI3IiBoZWlnaHQ9IjQ1OSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
          />
          <GameCard.Description>{question.title}</GameCard.Description>
        </GameCard.Root>
      ))}
    </div>
  )
}
