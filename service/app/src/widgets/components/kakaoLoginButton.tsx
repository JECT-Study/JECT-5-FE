import { SecondaryOutlineBoxButton } from "@ject-5-fe/design/components/button"
import Image from "next/image"
import Link from "next/link"

interface KakaoLoginButtonProps {
  className?: string
  returnTo?: string
}

export const KakaoLoginButton = ({
  className,
  returnTo,
}: KakaoLoginButtonProps) => {
  return (
    <SecondaryOutlineBoxButton size="md" className={className} asChild>
      <Link
        href={{
          pathname: "/login",
          query: returnTo ? { returnTo } : undefined,
        }}
      >
        <Image
          src="/kakao-logo.svg"
          alt="카카오 로고"
          className="size-32"
          width={32}
          height={32}
        />
        간편로그인해서 게임 만들기
      </Link>
    </SecondaryOutlineBoxButton>
  )
}
