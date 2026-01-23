"use client"

import { DialogHeader } from "@ject-5-fe/design/components/dialog"

interface GamePreviewTitleProps {
  gameTitle?: string
  creatorName?: string
  showCreatorName?: boolean
}

export const GamePreviewTitle = ({
  gameTitle,
  creatorName,
  showCreatorName = true,
}: GamePreviewTitleProps) => {
  return (
    <div className="flex w-[370px] flex-col gap-[8px] text-start">
      <DialogHeader asChild className="items-start p-0">
        <h2
          className="typography-heading-xl-semibold line-clamp-1 text-text-primary"
          data-testid="game-preview-game-title"
        >
          {gameTitle}
        </h2>
      </DialogHeader>
      {showCreatorName && creatorName && (
        <span
          className="line-clamp-1 text-[19px] font-light leading-[120%] text-text-primary"
          data-testid="game-preview-creator-name"
        >
          {creatorName}
        </span>
      )}
    </div>
  )
}
