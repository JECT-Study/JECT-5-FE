import { DropdownMenuItem } from "@ject-5-fe/design/components/menu"
import { Edit, Share, Trash, Unshare, Upload } from "@ject-5-fe/design/icons"

export type GameCardOptionsProps = {
  shared?: boolean
  onEdit?: () => void
  onShare?: () => void
  onDelete?: () => void
  onCopyLink?: () => void
  onClone?: () => void
}

export function GameCardOptions({
  shared,
  onEdit,
  onShare,
  onDelete,
  onCopyLink,
}: GameCardOptionsProps) {
  return (
    <>
      <DropdownMenuItem
        type="icon"
        onClick={(event) => {
          event.stopPropagation()
          onEdit?.()
        }}
      >
        <Edit />
        <span className="text-text-interactive-secondary">게임 수정</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        type="icon"
        onClick={(event) => {
          event.stopPropagation()
          onShare?.()
        }}
      >
        {shared ? <Unshare /> : <Upload />}
        <span className="text-text-interactive-secondary">
          {shared ? "공유 취소" : "게임 등록"}
        </span>
      </DropdownMenuItem>
      <DropdownMenuItem
        type="icon"
        onClick={(event) => {
          event.stopPropagation()
          onDelete?.()
        }}
      >
        <Trash />
        <span className="text-text-interactive-secondary">게임 삭제</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        type="icon"
        onClick={(event) => {
          event.stopPropagation()
          onCopyLink?.()
        }}
      >
        <Share />
        <span className="text-text-interactive-secondary">링크 복사</span>
      </DropdownMenuItem>
    </>
  )
}
