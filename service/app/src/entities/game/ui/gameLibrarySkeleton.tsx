interface GameLibrarySkeletonProps {
  count?: number
}

export const GameLibrarySkeleton = ({
  count = 1,
}: GameLibrarySkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`game-library-skeleton-${index}`}
          className="flex w-[178px] flex-col items-start gap-[14px]"
        >
          <div className="size-[178px] animate-pulse rounded-[10px] bg-gray-200" />
          <div className="h-[46px] w-[178px] animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </>
  )
}
