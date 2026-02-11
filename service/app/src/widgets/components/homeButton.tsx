import Image from "next/image"
import Link from "next/link"

interface HomeButtonBaseProps {
  className?: string
}

interface HomeButtonLinkProps extends HomeButtonBaseProps {
  href?: string
  onClick?: never
}

interface HomeButtonClickProps extends HomeButtonBaseProps {
  href?: never
  onClick: () => void
}

type HomeButtonProps = HomeButtonLinkProps | HomeButtonClickProps

export const HomeButton = ({
  className = "",
  href,
  onClick,
}: HomeButtonProps) => {
  const buttonClassName = `flex shrink-0 cursor-pointer flex-col items-center justify-center gap-2.5 p-3.5 focus:outline-none ${className}`

  const logoImage = (
    <Image
      src="/logo.svg"
      alt="홈 로고"
      className="size-full"
      width={268}
      height={60}
    />
  )

  if (onClick) {
    return (
      <button type="button" className={buttonClassName} onClick={onClick}>
        {logoImage}
      </button>
    )
  }

  return (
    <Link className={buttonClassName} href={href ?? "/"}>
      {logoImage}
    </Link>
  )
}
