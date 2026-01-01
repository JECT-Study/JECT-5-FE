import Image from "next/image"
import Link from "next/link"

interface GameCreateProps {
  className?: string
}

export const GameCreate = ({ className = "" }: GameCreateProps) => {
  return (
    <Link
      className={`flex w-full flex-col items-center gap-12 ${className}`}
      href="/create"
      aria-label="게임 만들기"
    >
      <Image
        src="/create-game-icon.svg"
        alt="게임 만들기 아이콘"
        width={178}
        height={178}
        className="size-full object-contain"
      />

      <h3 className="typography-heading-sm-extrabold text-center text-text-primary">
        게임 만들기
      </h3>
    </Link>
  )
}
