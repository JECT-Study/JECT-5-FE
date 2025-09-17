"use client"

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
} from "@ject-5-fe/design/components/dialog"
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
    <Dialog open={isOpen} onOpenChange={() => onClose?.()}>
      <DialogContent
        className={`min-h-[574px] min-w-[987px] shrink-0 ${className}`}
      >
        {/* 팝업 닫기 버튼 */}
        <div className="flex h-[62px] w-full items-center justify-end px-[24px] py-[16px]">
          <SecondaryPlainIconButton
            size="lg"
            onClick={handleClose}
            aria-label="팝업 닫기"
          >
            <Cross />
          </SecondaryPlainIconButton>
        </div>

        {/* 팝업 내용 - 팝업헤더, 본문 감싸는 wrap */}
        <div className="flex w-full flex-col gap-[38px] px-[60px] pb-[36px]">
          {/* 팝업헤더 */}
          <DialogHeader className="flex w-[860px] flex-row items-start justify-between">
            {/* 게임 제목과 제작자 이름 container */}
            <div className="flex flex-col gap-[8px]">
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
          </DialogHeader>

          {/* 팝업본문 */}
          <DialogBody className="flex w-full flex-col items-start gap-[20px]">
            <p className="typography-heading-lg-medium text-text-primary">
              총 {questionCount} 문제
            </p>
            <div className="flex w-full items-center gap-[32px] overflow-x-auto p-0">
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
          </DialogBody>
        </div>
      </DialogContent>
    </Dialog>
  )
}
