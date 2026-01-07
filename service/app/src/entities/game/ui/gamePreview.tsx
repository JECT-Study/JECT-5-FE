"use client"

import {
  PrimaryBoxButton,
  SecondaryPlainIconButton,
} from "@ject-5-fe/design/components/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
} from "@ject-5-fe/design/components/dialog"
import { Cross, Play } from "@ject-5-fe/design/icons"

import * as GameCard from "@/entities/game/ui/GameCard/gameCard"

interface GamePreviewProps {
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

export const GamePreview = ({
  className = "",
  gameTitle,
  creatorName,
  questionCount = 10,
  questions = [],
  onClose,
  onStartGame,
  isOpen = true,
}: GamePreviewProps) => {
  const handleClose = () => {
    onClose?.()
  }

  const handleStartGame = () => {
    onStartGame?.()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={`overflow-hidden rounded-[20px] bg-background-interactive-primary-sub p-0 ${className} max-w-[980px] px-[60px] pb-[45px] pt-[62px]`}
      >
        <div className="absolute left-0 top-0 flex h-[62px] w-full items-center justify-end px-[24px] py-[16px]">
          <SecondaryPlainIconButton
            size="lg"
            onClick={handleClose}
            aria-label="게임 미리보기 닫기"
          >
            <Cross />
          </SecondaryPlainIconButton>
        </div>

        <div className="flex size-full flex-col items-center justify-center">
          <div className="flex h-auto w-full flex-col gap-[28px]">
            <div className="flex w-full items-start justify-between">
              <div className="flex w-[370px] flex-col gap-[8px] text-start">
                <DialogHeader asChild className="items-start p-0">
                  <h2
                    className="typography-heading-xl-semibold line-clamp-1 text-text-primary"
                    data-testid="game-preview-game-title"
                  >
                    {gameTitle}
                  </h2>
                </DialogHeader>
                <span
                  className="line-clamp-1 text-[19px] font-light leading-[120%] text-text-primary"
                  data-testid="game-preview-creator-name"
                >
                  {creatorName}
                </span>
              </div>

              <PrimaryBoxButton
                size="lg"
                _style="solid"
                onClick={handleStartGame}
              >
                <Play />
                게임 시작
              </PrimaryBoxButton>
            </div>

            <DialogBody
              className="flex w-full flex-col items-start gap-[20px] p-0 text-left"
              asChild
            >
              <div>
                <span
                  className="typography-heading-md-regular font-light text-text-primary"
                  data-testid="game-preview-question-count"
                >
                  총 {questionCount} 문제
                </span>
                <div
                  className="mt-[20px] flex w-full items-center gap-[32px] overflow-x-auto p-0"
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
                      <GameCard.Description>
                        {question.title}
                      </GameCard.Description>
                    </GameCard.Root>
                  ))}
                </div>
              </div>
            </DialogBody>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
