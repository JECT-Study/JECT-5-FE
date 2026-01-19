"use client"

import { PrimaryBoxButton } from "@ject-5-fe/design/components/button"
import { Play } from "@ject-5-fe/design/icons"

import { GamePreviewQuestionList } from "./gamePreviewQuestionList"
import { GamePreviewShell } from "./gamePreviewShell"
import { GamePreviewTitle } from "./gamePreviewTitle"

interface GamePreviewUserProps {
  className?: string
  gameTitle?: string
  creatorName?: string
  questionCount?: number
  questions?: Array<{
    id: string
    title: string
    imageUrl?: string
  }>
  onClose?: () => void
  onStartGame?: () => void
  isOpen?: boolean
}

export const GamePreviewUser = ({
  className = "",
  gameTitle,
  creatorName,
  questionCount = 10,
  questions = [],
  onClose,
  onStartGame,
  isOpen = true,
}: GamePreviewUserProps) => {
  const handleStartGame = () => {
    onStartGame?.()
  }

  return (
    <GamePreviewShell className={className} isOpen={isOpen} onClose={onClose}>
      <div className="flex size-full flex-col items-center justify-center">
        <div className="flex h-auto w-full flex-col gap-[28px]">
          <div className="flex w-full items-start justify-between">
            <GamePreviewTitle gameTitle={gameTitle} creatorName={creatorName} />
            <PrimaryBoxButton
              size="lg"
              _style="solid"
              onClick={handleStartGame}
            >
              <Play />
              게임 시작
            </PrimaryBoxButton>
          </div>

          <GamePreviewQuestionList
            questionCount={questionCount}
            questions={questions}
          />
        </div>
      </div>
    </GamePreviewShell>
  )
}
