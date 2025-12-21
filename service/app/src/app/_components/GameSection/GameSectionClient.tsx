"use client"

import type { GameListItem } from "@/entities/game"
import { useGamePreview } from "@/entities/game/hooks/useGamePreview"
import * as GameCard from "@/entities/game/ui/GameCard/gameCard"

interface GameSectionClientProps {
  games: GameListItem[]
}

export const GameSectionClient = ({ games }: GameSectionClientProps) => {
  const { openPreview } = useGamePreview()

  return (
    <div
      className="flex items-center justify-between"
      data-testid="game-section-cards"
    >
      {games?.map((game) => (
        <GameCard.Root
          key={game.gameId}
          className="w-[178px]"
          title={game.gameTitle}
          onClick={() => openPreview(game)}
          aria-label="게임 카드"
          tabIndex={0}
        >
          <GameCard.Image
            src={game.gameThumbnailUrl ?? "/checker.svg"}
            alt={game.gameTitle}
            sizes="178px"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzI3IiBoZWlnaHQ9IjQ1OSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
          >
            <GameCard.Badge>{game.questionCount}문제</GameCard.Badge>
            {game.isShared && (
              <GameCard.Badge variant="bottom-left">공유</GameCard.Badge>
            )}
          </GameCard.Image>
          <GameCard.Description>{game.gameTitle}</GameCard.Description>
        </GameCard.Root>
      ))}
    </div>
  )
}
