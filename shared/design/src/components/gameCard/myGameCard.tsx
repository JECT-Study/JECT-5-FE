import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef } from "react"

import { cn } from "../../utils/cn"
import { GameCardImage } from "./gameCardImage"
import { GameCardOptions } from "./gameCardOptions"

const myGameCardVariants = cva("relative", {
  variants: {
    type: {
      myGame: "",
    },
  },
  defaultVariants: {
    type: "myGame",
  },
})

const thumbnailVariants = cva(
  "relative rounded-[10px] bg-cover bg-center bg-no-repeat",
  {
    variants: {
      type: {
        myGame: "size-[178px]",
      },
    },
    defaultVariants: {
      type: "myGame",
    },
  },
)



const badgeVariants = cva(
  "absolute left-[8px] top-[8px] inline-flex items-center justify-center gap-[10px] rounded-[2px] bg-background-badge-primary px-[5px] py-[2px]",
  {
    variants: {
      type: {
        myGame: "block",
      },
    },
    defaultVariants: {
      type: "myGame",
    },
  },
)

const sharedBadgeVariants = cva(
  "absolute bottom-2 left-2 inline-flex items-center justify-center gap-[10px] rounded-[2px] bg-background-badge-secondary px-[5px] py-[2px]",
  {
    variants: {
      type: {
        myGame: "block",
      },
    },
    defaultVariants: {
      type: "myGame",
    },
  },
)

const titleVariants = cva(
  "line-clamp-2 w-[130px] shrink-0 overflow-hidden text-[19px] font-bold leading-[120%] text-text-primary",
  {
    variants: {
      type: {
        myGame: "h-[46px]",
      },
    },
    defaultVariants: {
      type: "myGame",
    },
  },
)

const titleContainerVariants = cva(
  "flex h-[46px] w-[178px] items-start justify-end",
  {
    variants: {
      type: {
        myGame: "",
      },
    },
    defaultVariants: {
      type: "myGame",
    },
  },
)



export type MyGameCardVariantProps = VariantProps<typeof myGameCardVariants>

type MyGameCardProps = {
  title: string
  questionCount: number
  imageUrl?: string
  className?: string
  shared?: boolean
  onEdit?: () => void
  onShare?: () => void
  onDelete?: () => void
  ImageComponent?: React.ComponentType<{
    src: string
    alt: string
    className?: string
    onLoad?: () => void
    onError?: () => void
  }>
}

export const MyGameCard = forwardRef<HTMLDivElement, MyGameCardProps>(
  (props, ref) => {
    const { 
      title, 
      questionCount, 
      imageUrl, 
      className, 
      shared,
      onEdit,
      onShare,
      onDelete,
      ImageComponent
    } = props

    const renderThumbnail = () => (
      <div className={cn(thumbnailVariants({ type: "myGame" }), className)}>
        <GameCardImage
          imageUrl={imageUrl}
          title={title}
          type="myGame"
          ImageComponent={ImageComponent}
        />
        
        <div
          className={cn(badgeVariants({ type: "myGame" }))}
          data-testid="question-count"
        >
          <span className="text-[13px] font-normal leading-[120%] text-text-inverse">
            {questionCount}문제
          </span>
        </div>
        {shared && (
          <div
            className={cn(sharedBadgeVariants({ type: "myGame" }))}
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
      <div className={cn(titleContainerVariants({ type: "myGame" }))}>
        <div className={cn(titleVariants({ type: "myGame" }))} data-testid="game-title">
          {title}
        </div>
        <GameCardOptions
          shared={shared}
          onEdit={onEdit}
          onShare={onShare}
          onDelete={onDelete}
        />
      </div>
    )

    return (
      <div
        ref={ref}
        className={cn(myGameCardVariants({ type: "myGame" }))}
        data-testid="game-card"
      >
        <div className="flex flex-col gap-[14px]">
          {renderThumbnail()}
          {renderTitle()}
        </div>
      </div>
    )
  },
)
