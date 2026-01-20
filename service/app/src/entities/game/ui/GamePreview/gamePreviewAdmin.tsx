"use client"

import { PrimaryBoxButton } from "@ject-5-fe/design/components/button"

import { GamePreviewQuestionList } from "./gamePreviewQuestionList"
import { GamePreviewReportTable } from "./gamePreviewReportTable"
import { GamePreviewShell } from "./gamePreviewShell"
import { GamePreviewTitle } from "./gamePreviewTitle"

interface GamePreviewAdminProps {
  className?: string
  gameTitle?: string
  questionCount?: number
  questions?: Array<{
    id: string
    title: string
    imageUrl?: string
  }>
  reportData?: {
    creator: {
      name: string
      email: string
    }
    reporter: {
      name: string
      email: string
    }
    category: string
  }
  onClose?: () => void
  onIgnoreReport?: () => void
  onDeleteGame?: () => void
  onBlockCreator?: () => void
  onBlockReporter?: () => void
  isOpen?: boolean
}

export const GamePreviewAdmin = ({
  className = "",
  gameTitle,
  questionCount = 10,
  questions = [],
  reportData,
  onClose,
  onIgnoreReport,
  onDeleteGame,
  onBlockCreator,
  onBlockReporter,
  isOpen = true,
}: GamePreviewAdminProps) => {
  return (
    <GamePreviewShell className={className} isOpen={isOpen} onClose={onClose}>
      <div className="flex size-full flex-col items-center justify-center">
        <div className="flex h-auto w-full flex-col gap-16">
          <div className="flex w-full items-start justify-between">
            <GamePreviewTitle gameTitle={gameTitle} showCreatorName={false} />
            <div className="flex items-center gap-16">
              <PrimaryBoxButton
                size="lg"
                _style="solid"
                onClick={onIgnoreReport}
              >
                신고 무시
              </PrimaryBoxButton>
              <PrimaryBoxButton
                size="lg"
                _style="solid"
                onClick={onDeleteGame}
                className="bg-background-interactive-destructive"
              >
                게임 삭제
              </PrimaryBoxButton>
            </div>
          </div>
          <div className="flex h-auto w-full flex-col gap-60">
            <GamePreviewQuestionList
              questionCount={questionCount}
              questions={questions}
            />

            {reportData && (
              <GamePreviewReportTable
                creator={reportData.creator}
                reporter={reportData.reporter}
                category={reportData.category}
                onBlockCreator={onBlockCreator}
                onBlockReporter={onBlockReporter}
              />
            )}
          </div>
        </div>
      </div>
    </GamePreviewShell>
  )
}
