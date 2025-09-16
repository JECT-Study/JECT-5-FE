import Image from "next/image"
import Link from "next/link"

interface HomeButtonProps {
  className?: string
}

export const HomeButton = ({ className = "" }: HomeButtonProps) => {
  return (
    <Link
      className={`flex shrink-0 cursor-pointer flex-col items-center justify-center gap-2.5 p-3.5 focus:outline-none ${className}`}
      href="/"
    >
      <Image
        src="/logo.svg"
        alt="홈 로고"
        className="size-full"
        width={268}
        height={60}
      />
    </Link>
  )
}
