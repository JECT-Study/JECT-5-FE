import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../utils/cn"
import { useImageState } from "./hooks/useImageState"

const imageVariants = cva(
  "shrink-0 rounded-[10px] bg-cover bg-center bg-no-repeat",
  {
    variants: {
      type: {
        libraryGame: "size-[178px]",
        gamePreview: "h-[260px] w-[178px]",
        onlyTitleGamePreview: "hidden",
        myGame: "size-[178px]",
      },
    },
    defaultVariants: {
      type: "libraryGame",
    },
  },
)

const skeletonVariants = cva(
  "animate-pulse rounded-[10px] bg-gray-200",
  {
    variants: {
      type: {
        libraryGame: "size-[178px]",
        gamePreview: "h-[260px] w-[178px]",
        onlyTitleGamePreview: "hidden",
        myGame: "size-[178px]",
      },
    },
    defaultVariants: {
      type: "libraryGame",
    },
  },
)

export type GameCardImageVariantProps = VariantProps<typeof imageVariants>

type GameCardImageProps = {
  imageUrl?: string
  title: string
  type: GameCardImageVariantProps["type"]
  className?: string
  ImageComponent?: React.ComponentType<{
    src: string
    alt: string
    className?: string
    onLoad?: () => void
    onError?: () => void
  }>
}

export const GameCardImage = ({ imageUrl, title, type, className }: GameCardImageProps) => {
  const { imageLoading, imageError, handleLoad, handleError } = useImageState()

  if (!imageUrl || imageError) {
    return (
      <div
        className={cn(
          imageVariants({ type }),
          "flex items-center justify-center bg-gray-200",
          className
        )}
        data-testid="image-placeholder"
      >
        <span className="text-[14px] font-medium text-gray-500">
          {imageError ? "이미지 로드 실패" : "이미지 없음"}
        </span>
      </div>
    )
  }

  return (
    <div className={cn(imageVariants({ type }), "relative", className)}>
      {imageLoading && (
        <div
          className={cn(skeletonVariants({ type }), "absolute inset-0")}
          data-testid="image-skeleton"
        />
      )}
      
      <img
        src={imageUrl}
        alt={title}
        className={cn(
          "size-full rounded-[10px] object-cover transition-opacity duration-500 ease-in-out",
          imageLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}
