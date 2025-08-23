import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef } from "react"

import { cn } from "../../utils/cn"
import { GameCardImage } from "./gameCardImage"

type DefaultGameTitleProps = {
  type: "libraryGame" | "gamePreview" | "onlyTitleGamePreview"
  title: string
}

function DefaultGameTitle({ type, title }: DefaultGameTitleProps) {
  return (
    <div
      className={cn(titleVariants({ type }), "line-clamp-2")}
      data-testid="game-title"
    >
      {title}
    </div>
  )
}

const gameCardVariants = cva("relative", {
  variants: {
    type: {
      libraryGame: "",
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
      gamePreview: "h-[46px] w-[178px]",
      onlyTitleGamePreview: "h-[46px] w-[178px]",
    },
  },
  defaultVariants: {
    type: "libraryGame",
  },
})


export type GameCardVariantProps = VariantProps<typeof gameCardVariants>

type BaseGameCardProps = {
  title: string
  questionCount: number
  imageUrl?: string
  className?: string
  shared?: boolean
  ImageComponent?: React.ComponentType<{
    src: string
    alt: string
    className?: string
    onLoad?: () => void
    onError?: () => void
  }>
}

type LibraryGameCardProps = BaseGameCardProps & {
  type: "libraryGame"
}

type GamePreviewCardProps = BaseGameCardProps & {
  type: "gamePreview"
}

type OnlyTitleGamePreviewCardProps = BaseGameCardProps & {
  type: "onlyTitleGamePreview"
}

type GameCardProps =
  | LibraryGameCardProps
  | GamePreviewCardProps
  | OnlyTitleGamePreviewCardProps

export const GameCard = forwardRef<HTMLDivElement, GameCardProps>(
  (props, ref) => {
    const { type, title, questionCount, imageUrl, className, shared, ImageComponent } = props

    const renderThumbnail = () => (
      <div className={cn(thumbnailVariants({ type }), className)}>
        <GameCardImage
          imageUrl={imageUrl}
          title={title}
          type={type}
          ImageComponent={ImageComponent}
        />
        
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
        <DefaultGameTitle type={type} title={title} />
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
