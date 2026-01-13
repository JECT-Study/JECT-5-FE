"use client"

import { DropdownMenuItem } from "@ject-5-fe/design/components/menu"
import { Copy, Share, Warning } from "@ject-5-fe/design/icons"
import { type MouseEvent } from "react"

import type { GameListItem } from "@/entities/game"

import { useActions } from "../hooks/useGameCardActions"
import { openReportGameDialog } from "./reportGameDialog"

interface GameCardActionsProps {
  game: GameListItem
}

export const GameCardActions = ({ game }: GameCardActionsProps) => {
  const { copy, clone } = useActions()

  const handleCopyLink = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    const origin = window.location.origin
    copy(`${origin}/game/${game.gameId}`)
  }

  const handleCloneGame = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    clone(game.gameId)
  }

  const handleReportGame = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    openReportGameDialog({ gameId: game.gameId })
  }

  return (
    <>
      <DropdownMenuItem
        type="icon"
        onClick={handleCopyLink}
        className="cursor-pointer"
      >
        <Share />
        <span className="text-text-interactive-secondary">링크 복사</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        type="icon"
        onClick={handleCloneGame}
        className="cursor-pointer"
      >
        <Copy />
        <span className="text-text-interactive-secondary">게임 복제</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        type="icon"
        onClick={handleReportGame}
        className="cursor-pointer"
      >
        <Warning />
        <span className="text-text-interactive-secondary">게임 신고</span>
      </DropdownMenuItem>
    </>
  )
}
