"use client"

interface GameCreateProps {
  onClick?: () => void
  className?: string
}

export const GameCreate = ({ onClick, className = "" }: GameCreateProps) => {
  return (
    <div
      className={`flex w-[178px] cursor-pointer flex-col items-center gap-4 ${className}`}
      onClick={onClick}
    >
      {/* Icon */}
      <div className="flex h-[168px] w-[178px] items-center justify-center">
        <img
          src="/create-game-icon.svg"
          alt="게임 만들기 아이콘"
          width={178}
          height={168}
          className="size-full"
        />
      </div>

      {/* Text */}
      <h3 className="typography-heading-sm-bold truncate text-center text-text-primary">
        게임 만들기
      </h3>
    </div>
  )
} 