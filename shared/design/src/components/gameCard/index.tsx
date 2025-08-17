import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef, useState } from "react"

import { Edit, MoreDot, Trash, Unshare, Upload } from "../../icons"
import { cn } from "../../utils/cn"
import { SecondaryPlainIconButton } from "../button"
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "../menu"

const gameCardVariants = cva("relative", {
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
})

const thumbnailVariants = cva(
  "relative rounded-[10px] bg-cover bg-center bg-no-repeat",
  {
    variants: {
      type: {
        libraryGame: "size-[178px]",
        myGame: "size-[178px]",
        gamePreview:
          "flex h-[260px] w-[178px] flex-col items-center justify-center",
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

const sharedBadgeVariants = cva(
  "absolute bottom-2 left-2 inline-flex items-center justify-center gap-[10px] rounded-[2px] bg-background-badge-secondary px-[5px] py-[2px]",
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

const titleContainerVariants = cva("", {
  variants: {
    type: {
      libraryGame: "h-[46px] w-[178px]",
      myGame: "flex w-[178px] justify-end",
      gamePreview: "h-[46px] w-[178px]",
      onlyTitleGamePreview: "h-[46px] w-[178px]",
    },
  },
  defaultVariants: {
    type: "libraryGame",
  },
})

const skeletonVariants = cva(
  "animate-pulse rounded-[10px] bg-gradient-to-br from-gray-200 to-gray-300",
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

export type GameCardVariantProps = VariantProps<typeof gameCardVariants>

type BaseGameCardProps = {
  title: string
  questionCount: number
  imageUrl?: string
  className?: string
  shared?: boolean
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
    const { type, title, questionCount, imageUrl, className, shared } = props
    const [imageLoading, setImageLoading] = useState(true)
    const [imageError, setImageError] = useState(false)

    const renderThumbnail = () => (
      <div className={cn(thumbnailVariants({ type }), className)}>
        {imageUrl && !imageError ? (
          <>
            {imageLoading && (
              <div
                className={cn(skeletonVariants({ type }), "absolute inset-0")}
                data-testid="image-skeleton"
              />
            )}
            
            <div className={cn(imageVariants({ type }), "relative")}>
              <img
                src={imageUrl}
                alt={title}
                className={cn(
                  "size-full rounded-[10px] object-cover transition-opacity duration-500 ease-in-out",
                  imageLoading ? "opacity-0" : "opacity-100"
                )}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false)
                  setImageError(true)
                }}
              />
            </div>
          </>
        ) : (
          /* 이미지가 없거나 에러인 경우 placeholder */
          <div
            className={cn(
              imageVariants({ type }),
              "flex items-center justify-center bg-gray-200"
            )}
            data-testid="image-placeholder"
          >
            <span className="text-[14px] font-medium text-gray-500">
              {imageError ? "이미지 로드 실패" : "이미지 없음"}
            </span>
          </div>
        )}
        
        <div
          className={cn(badgeVariants({ type }))}
          data-testid="question-count"
        >
          <span className="text-[13px] font-normal leading-[120%] text-text-inverse">
            {questionCount}문제
          </span>
        </div>
        {shared && (
          <div
            className={cn(sharedBadgeVariants({ type }))}
            data-testid="shared-badge"
          >
            <span className="text-[13px] font-normal leading-[120%] text-text-inverse">
              공유
            </span>
          </div>
        )}
      </div>
    )

    const renderTitle = () => (
      <div className={cn(titleContainerVariants({ type }))}>
        {type === "myGame" ? (
          <>
            <div
              className="line-clamp-2 w-[130px] shrink-0 overflow-hidden text-[19px] font-bold leading-[120%] text-text-primary"
              data-testid="game-title"
            >
              {title}
            </div>
            <DropdownMenuRoot>
              <DropdownMenuTrigger asChild>
                <SecondaryPlainIconButton
                  aria-label="게임 옵션"
                  onClick={(e) => e.stopPropagation()}
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
                  onClick={(e) => {
                    e.stopPropagation()
                    props.onEdit?.()
                  }}
                >
                  <Edit />
                  <span className="text-text-interactive-secondary">
                    게임 수정
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  type="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    props.onShare?.()
                  }}
                >
                  {shared ? <Unshare /> : <Upload />}
                  <span className="text-text-interactive-secondary">
                    {shared ? "공유 취소" : "게임 공유"}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  type="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    props.onDelete?.()
                  }}
                >
                  <Trash />
                  <span className="text-text-interactive-secondary">
                    게임 삭제
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuRoot>
          </>
        ) : (
          <div
            className={cn(titleVariants({ type }), "line-clamp-2")}
            data-testid="game-title"
          >
            {title}
          </div>
        )}
      </div>
    )

    return (
      <div
        ref={ref}
        className={cn(gameCardVariants({ type }))}
        data-testid="game-card"
      >
        <div className="flex flex-col gap-[14px]">
          {renderThumbnail()}
          <div className="h-[46px]">{renderTitle()}</div>
        </div>
      </div>
    )
  },
)
