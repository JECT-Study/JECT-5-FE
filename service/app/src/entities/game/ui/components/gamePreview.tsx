"use client"

import { Dialog, DialogContent } from "@ject-5-fe/design/components/dialog"
import {
  PrimaryBoxButton,
  SecondaryPlainIconButton,
} from "@shared/design/src/components/button"
import { GameCard } from "@shared/design/src/components/gameCard"
import { Cross, Play } from "@shared/design/src/icons"
import Image from "next/image"

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
  gameTitle = "연예인 맞히기",
  creatorName = "제작자 이름",
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
    <Dialog open={isOpen} onOpenChange={() => onClose?.()}>
      <DialogContent className="max-w-[987px] border-none bg-transparent p-0 shadow-none">
        <div
          className={`flex w-[987px] flex-col rounded-[10px] bg-background-interactive-primary-sub ${className}`}
        >
          <div
            className="flex h-[62px] w-full items-center justify-end gap-[10px] px-[22px] py-[15px]"
            data-testid="close-area"
          >
            <SecondaryPlainIconButton
              size="lg"
              onClick={handleClose}
              aria-label="팝업 닫기"
            >
              <Cross />
            </SecondaryPlainIconButton>
          </div>

          <div className="flex w-full flex-col gap-[25px] px-[60px] pb-[60px]">
            <div className="flex w-[860px] items-start justify-between">
              <div className="flex flex-col gap-[18px]">
                <h2 className="typography-heading-xl-semibold text-text-primary">
                  {gameTitle}
                </h2>
                <p className="typography-body-md-medium text-text-secondary">
                  {creatorName}
                </p>
              </div>
              <PrimaryBoxButton
                size="lg"
                _style="solid"
                onClick={handleStartGame}
                aria-label="게임 시작"
              >
                <Play />
                게임 시작
              </PrimaryBoxButton>
            </div>

            <p className="typography-heading-lg-medium text-text-primary">
              총 {questionCount} 문제
            </p>

            <div
              className="flex items-center gap-[34px] overflow-x-auto"
              data-testid="image-carousel"
            >
              {questions.map((question, _index) => (
                <GameCard key={question.id}>
                  {question.imageUrl ? (
                    <GameCard.Image className="h-[260px]">
                      <Image
                        src={question.imageUrl}
                        alt={question.title}
                        fill
                        className="rounded-[10px] object-cover"
                        sizes="178px"
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzI3IiBoZWlnaHQ9IjQ1OSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
                      />
                    </GameCard.Image>
                  ) : null}
                  <GameCard.Title>{question.title}</GameCard.Title>
                </GameCard>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
