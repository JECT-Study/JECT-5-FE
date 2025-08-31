import type { MouseEvent } from "react"

import { Edit, MoreDot, Trash, Unshare, Upload } from "../../icons"
import { SecondaryPlainIconButton } from "../button"
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "../menu"

export type GameCardOptionsProps = {
  shared?: boolean
  onEdit?: () => void
  onShare?: () => void
  onDelete?: () => void
}

export function GameCardOptions({
  shared,
  onEdit,
  onShare,
  onDelete,
}: GameCardOptionsProps) {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger asChild>
        <SecondaryPlainIconButton
          size="sm"
          aria-label="게임 옵션"
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation()
          }}
        >
          <MoreDot />
        </SecondaryPlainIconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        type="horizontal"
        contentType="icon"
        side="bottom"
        sideOffset={8}
      >
        <DropdownMenuItem
          type="icon"
          onClick={(e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation()
            onEdit?.()
          }}
        >
          <Edit />
          <span className="text-text-interactive-secondary">게임 수정</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          type="icon"
          onClick={(e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation()
            onShare?.()
          }}
        >
          {shared ? <Unshare /> : <Upload />}
          <span className="text-text-interactive-secondary">
            {shared ? "공유 취소" : "게임 공유"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          type="icon"
          onClick={(e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation()
            onDelete?.()
          }}
        >
          <Trash />
          <span className="text-text-interactive-secondary">게임 삭제</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  )
}
