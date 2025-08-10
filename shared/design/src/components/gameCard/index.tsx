import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef } from "react"

import { Edit, MoreDot, Trash, Upload } from "../../icons"
import { cn } from "../../utils/cn"
import { SecondaryPlainIconButton } from "../button"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuRoot, DropdownMenuTrigger } from "../menu"

const gameCardVariants = cva(
  "relative",
  {
    variants: {
      type: {
        libraryGame: "",
        myGame: "",
        gamePreview: "",
        onlyTitleGamePreview: "",
      },
    },
    defaultVariants: {
      type: "libraryGame",
    },
  },
)

const thumbnailVariants = cva(
  "rounded-[10px] bg-cover bg-center bg-no-repeat",
  {
    variants: {
      type: {
        libraryGame: "relative size-[178px]",
        myGame: "relative size-[178px]",
        gamePreview: "flex h-[260px] w-[178px] flex-col items-center justify-center",
        onlyTitleGamePreview: "hidden",
      },
    },
    defaultVariants: {
      type: "libraryGame",
    },
  },
)

const imageVariants = cva(
  "shrink-0 rounded-[10px] bg-cover bg-center bg-no-repeat",
  {
    variants: {
      type: {
        libraryGame: "size-[178px]",
        myGame: "size-[178px]",
        gamePreview: "h-[260px] w-[178px]",
        onlyTitleGamePreview: "hidden",
      },
    },
    defaultVariants: {
      type: "libraryGame",
    },
  },
)

const badgeVariants = cva(
  "absolute left-2 top-2 inline-flex items-center justify-center gap-[10px] rounded-[2px] bg-background-badge-primary px-[5px] py-[2px]",
  {
    variants: {
      type: {
        libraryGame: "block",
        myGame: "block",
        gamePreview: "hidden",
        onlyTitleGamePreview: "hidden",
      },
    },
    defaultVariants: {
      type: "libraryGame",
    },
  },
)

const titleVariants = cva(
  "overflow-hidden text-ellipsis text-[19px] font-bold leading-[120%] text-text-primary",
  {
    variants: {
      type: {
        libraryGame: "h-[46px] w-[178px]",
        myGame: "h-[46px] w-[130px] shrink-0 overflow-hidden",
        gamePreview: "h-[46px] w-[178px]",
        onlyTitleGamePreview: "h-[46px] w-[178px]",
      },
    },
    defaultVariants: {
      type: "libraryGame",
    },
  },
)

const titleContainerVariants = cva(
  "",
  {
    variants: {
      type: {
        libraryGame: "h-[46px] w-[178px]",
        myGame: "flex  w-[178px] justify-end",
        gamePreview: "h-[46px] w-[178px]",
        onlyTitleGamePreview: "h-[46px] w-[178px]",
      },
    },
    defaultVariants: {
      type: "libraryGame",
    },
  },
)



export type GameCardVariantProps = VariantProps<typeof gameCardVariants>

type BaseGameCardProps = {
  title: string
  questionCount: number
  imageUrl?: string
  className?: string
}

type LibraryGameCardProps = BaseGameCardProps & {
  type: "libraryGame"
  optionView?: never
}

type MyGameCardProps = BaseGameCardProps & {
  type: "myGame"
  optionView?: boolean
  onEdit?: () => void
  onShare?: () => void
  onDelete?: () => void
  onMoreClick?: () => void
}

type GamePreviewCardProps = BaseGameCardProps & {
  type: "gamePreview"
  optionView?: never
}

type OnlyTitleGamePreviewCardProps = BaseGameCardProps & {
  type: "onlyTitleGamePreview"
  optionView?: never
}

type GameCardProps = 
  | LibraryGameCardProps 
  | MyGameCardProps 
  | GamePreviewCardProps 
  | OnlyTitleGamePreviewCardProps

export const GameCard = forwardRef<HTMLDivElement, GameCardProps>(
  (props, ref) => {
    const { type, title, questionCount, imageUrl, className } = props

    const renderThumbnail = () => (
      <div className={cn(thumbnailVariants({ type }), className)}>
        <div 
          className={cn(imageVariants({ type }))}
          style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : undefined }}
        />
        <div className={cn(badgeVariants({ type }))}>
          <span className="text-[13px] font-normal leading-[120%] text-text-inverse">
            {questionCount}문제
          </span>
        </div>
      </div>
    )

    const renderTitle = () => (
      <div className={cn(titleContainerVariants({ type }))}>
        {type === 'myGame' ? (
          <>
            <div className="line-clamp-2 w-[130px] shrink-0 overflow-hidden text-[19px] font-bold leading-[120%] text-text-primary">
              {title}
            </div>
            <DropdownMenuRoot>
              <DropdownMenuTrigger asChild>
                <SecondaryPlainIconButton aria-label="게임 옵션 메뉴">
                  <MoreDot />
                </SecondaryPlainIconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent type="horizontal" contentType="icon" side="bottom" sideOffset={8}>
                <DropdownMenuItem type="icon" onClick={props.onEdit}>
                  <Edit />
                  <span className="text-text-interactive-secondary">게임 수정</span>
                </DropdownMenuItem>
                <DropdownMenuItem type="icon" onClick={props.onShare}>
                  <Upload />
                  <span className="text-text-interactive-secondary">게임 공유</span>
                </DropdownMenuItem>
                <DropdownMenuItem type="icon" onClick={props.onDelete}>
                  <Trash />
                  <span className="text-text-interactive-secondary">게임 삭제</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuRoot>
          </>
        ) : (
          <div className={cn(titleVariants({ type }), "line-clamp-2")}>
            {title}
          </div>
        )}
      </div>
    )

    return (
      <div ref={ref} className={cn(gameCardVariants({ type }))}>
        <div className="flex flex-col gap-[14px]">
          {renderThumbnail()}
          <div className="h-[46px]">
            {renderTitle()}
          </div>
        </div>
      </div>
    )
  },
)