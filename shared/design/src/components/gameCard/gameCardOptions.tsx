import { Edit, MoreDot, Trash, Unshare, Upload } from "../../icons"
import { stopAnd } from "../../utils/eventHandlers"
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

export function GameCardOptions({ shared, onEdit, onShare, onDelete }: GameCardOptionsProps) {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger asChild>
        <SecondaryPlainIconButton
          aria-label="게임 옵션"
          onClick={stopAnd()}
          data-testid="game-options-button"
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
          onClick={stopAnd(onEdit)}
        >
          <Edit />
          <span className="text-text-interactive-secondary">
            게임 수정
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          type="icon"
          onClick={stopAnd(onShare)}
        >
          {shared ? <Unshare /> : <Upload />}
          <span className="text-text-interactive-secondary">
            {shared ? "공유 취소" : "게임 공유"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          type="icon"
          onClick={stopAnd(onDelete)}
        >
          <Trash />
          <span className="text-text-interactive-secondary">
            게임 삭제
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  )
}
