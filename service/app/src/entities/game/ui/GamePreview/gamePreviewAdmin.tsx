"use client"

import { PrimaryBoxButton } from "@ject-5-fe/design/components/button"

import type { AdminReportStatus } from "@/entities/report/model/types"

import { GamePreviewQuestionList } from "./gamePreviewQuestionList"
import { GamePreviewReportTable } from "./gamePreviewReportTable"
import { GamePreviewShell } from "./gamePreviewShell"
import { GamePreviewTitle } from "./gamePreviewTitle"

interface GamePreviewAdminProps {
  className?: string
  gameTitle?: string
  questionCount?: number
  questions?: Array<{
    id: number
    title: string
    imageUrl?: string
  }>
  reportData?: {
    creator: {
      name: string
      email: string
      isBlocked: boolean
    }
    reporter: {
      name: string
      email: string
      isBlocked: boolean
    }
    category: string
  }
  status: AdminReportStatus
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
  status,
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
            <div className="z-50 flex items-center gap-16">
              <PrimaryBoxButton
                size="lg"
                _style="solid"
                onClick={onIgnoreReport}
                disabled={status === "GAME_DELETED"}
              >
                신고 무시
              </PrimaryBoxButton>
              <PrimaryBoxButton
                size="lg"
                _style="solid"
                onClick={onDeleteGame}
                className="bg-background-interactive-destructive"
                disabled={status === "GAME_DELETED"}
              >
                게임 삭제
              </PrimaryBoxButton>
            </div>
          </div>
          <div className="flex h-auto w-full flex-col gap-60">
            <div className="flex w-full flex-col items-start gap-20">
              <span
                className="typography-heading-md-regular font-light text-text-primary"
                data-testid="game-preview-question-count"
              >
                총 {questionCount} 문제
              </span>
              {status === "GAME_DELETED" ? (
                <div className="typography-heading-xl-medium flex h-[310px] w-full items-center justify-center text-center text-text-interactive-input-error">
                  삭제 처리된 게임입니다.
                </div>
              ) : (
                <GamePreviewQuestionList questions={questions} />
              )}
            </div>

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
