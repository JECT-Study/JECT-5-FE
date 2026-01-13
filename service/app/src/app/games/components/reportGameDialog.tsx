"use client"

import {
  PrimaryBoxButton,
  SecondaryPlainIconButton,
} from "@ject-5-fe/design/components/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogHeader,
} from "@ject-5-fe/design/components/dialog"
import { RadioField } from "@ject-5-fe/design/components/radioField"
import { Cross } from "@ject-5-fe/design/icons"
import { overlay } from "overlay-kit"
import { useState } from "react"
import { toast } from "sonner"

import { reportGame } from "@/entities/game/api/reportGame"
import type { ReportReasonCode } from "@/entities/game/model/report"
import type { UUID } from "@/shared/api/types/common"

const REPORT_REASON_OPTIONS: Array<{ value: ReportReasonCode; label: string }> =
  [
    {
      value: "VIOLENT_OR_DISTURBING_CONTENT",
      label: "폭력적이거나 불편한 컨텐츠",
    },
    { value: "SEXUAL_CONTENT", label: "성적인 컨텐츠" },
    {
      value: "CYBERBULLYING_OR_HARASSMENT",
      label: "사이버 폭력 또는 괴롭힘",
    },
    { value: "SUICIDE_OR_SELF_HARM", label: "자살 또는 자해" },
    { value: "FRAUD_OR_MISINFORMATION", label: "사기 또는 거짓된 정보" },
    { value: "SPAM_OR_PROMOTION", label: "스팸 또는 홍보" },
    { value: "PRIVACY_VIOLATION", label: "개인정보 침해" },
    {
      value: "INTELLECTUAL_PROPERTY_INFRINGEMENT",
      label: "지식재산권 침해",
    },
  ]

export interface ReportGameDialogOptions {
  gameId: UUID
  onReported?: () => void
}

function ReportGameDialogContent({
  gameId,
  onReported,
  close,
  isOpen,
}: ReportGameDialogOptions & { close: () => void; isOpen: boolean }) {
  const [reasonCode, setReasonCode] = useState<ReportReasonCode | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReport = async () => {
    if (!reasonCode || isSubmitting) return

    try {
      setIsSubmitting(true)
      await reportGame(gameId, reasonCode)
      toast.success("신고가 접수되었습니다.")
      onReported?.()
      close()
    } catch {
      toast.error("신고에 실패했습니다. 잠시 후 다시 시도해 주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="fixed px-20 py-28">
        <div className="flex w-full flex-col items-center gap-36">
          <div className="flex w-full flex-col items-center gap-28 px-28">
            <div className="flex flex-col items-center">
              <DialogHeader className="typography-heading-md-semibold flex w-[259px] items-start p-0">
                게임 신고
              </DialogHeader>
              <DialogBody className="typography-body-lg-regular flex w-full items-start p-0">
                게임을 신고하는 이유를 알려주세요.
              </DialogBody>
            </div>

            <div className="flex w-[259px] flex-col items-start gap-24">
              {REPORT_REASON_OPTIONS.map((option) => (
                <RadioField
                  key={option.value}
                  name="game-report-reason"
                  value={option.value}
                  checked={reasonCode === option.value}
                  onCheckedChange={() => setReasonCode(option.value)}
                >
                  <span className="typography-body-lg-semibold">
                    {option.label}
                  </span>
                </RadioField>
              ))}
            </div>
          </div>
          <PrimaryBoxButton
            onClick={handleReport}
            disabled={!reasonCode || isSubmitting}
            className="w-full"
          >
            신고하기
          </PrimaryBoxButton>
        </div>

        <DialogClose asChild>
          <SecondaryPlainIconButton
            size="lg"
            className="absolute right-20 top-[18px]"
            aria-label="닫기"
          >
            <Cross />
          </SecondaryPlainIconButton>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export function openReportGameDialog(options: ReportGameDialogOptions) {
  overlay.open(({ isOpen, close }) => (
    <ReportGameDialogContent {...options} isOpen={isOpen} close={close} />
  ))
}
