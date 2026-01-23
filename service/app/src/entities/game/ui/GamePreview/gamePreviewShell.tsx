"use client"

import { SecondaryPlainIconButton } from "@ject-5-fe/design/components/button"
import { Dialog, DialogContent } from "@ject-5-fe/design/components/dialog"
import { Cross } from "@ject-5-fe/design/icons"
import type { PropsWithChildren } from "react"

interface GamePreviewShellProps extends PropsWithChildren {
  className?: string
  isOpen?: boolean
  onClose?: () => void
}

export const GamePreviewShell = ({
  children,
  className = "",
  isOpen = true,
  onClose,
}: GamePreviewShellProps) => {
  const handleClose = () => {
    onClose?.()
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
        {children}
      </DialogContent>
    </Dialog>
  )
}
