"use client"

import { PrimaryBoxButton, SecondaryPlainIconButton } from "@shared/design/src/components/button"
import { GameCard } from "@shared/design/src/components/gameCard"
import { Cross, Play } from "@shared/design/src/icons"

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
}

export const GamePreview = ({
  className = "",
  gameTitle = "연예인 맞히기",
  creatorName = "제작자 이름",
  questionCount = 10,
  questions = [],
  onClose,
  onStartGame,
}: GamePreviewProps) => {
  return (
    <div
      className={`flex w-[987px] flex-col rounded-[10px] bg-background-interactive-primary-sub ${className}`}
    >
      <div className="flex h-[62px] w-full items-center justify-end gap-[10px] px-[22px] py-[15px]">
        <SecondaryPlainIconButton
          size="lg"
          onClick={onClose}
        >
          <Cross />
        </SecondaryPlainIconButton>
      </div>

      <div className="flex w-full flex-col gap-[25px] px-[60px] pb-[60px]">
        <div className="flex w-[860px] items-start justify-between">
          <div className="flex flex-col gap-[18px]">
            <h2 className="typography-heading-xl-semibold text-neutral-black">
              {gameTitle}
            </h2>
            <p className="typography-body-md-medium text-neutral-black">
              {creatorName}
            </p>
          </div>
          <PrimaryBoxButton
            size="lg"
            _style="solid"
            onClick={onStartGame}
          >
            <Play />
            게임 시작
          </PrimaryBoxButton>
        </div>

        <p className="typography-heading-lg-medium text-neutral-black">
          총 {questionCount} 문제
        </p>

        <div className="flex items-center gap-[34px] overflow-x-auto">
          {questions.map((question, _index) => (
            <GameCard
              key={question.id}
              type={question.imageUrl ? "gamePreview" : "onlyTitleGamePreview"}
              title={question.title}
              questionCount={10}
              imageUrl={question.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
