"use client"

import { SecondaryOutlineBoxButton } from "@ject-5-fe/design/components/button"
import Image from "next/image"

interface KakaoLoginButtonProps {
  onClick?: () => void
  className?: string
}

export const KakaoLoginButton = ({
  onClick,
  className,
}: KakaoLoginButtonProps) => {
  return (
    <SecondaryOutlineBoxButton
      size="md"
      onClick={onClick}
      className={className}
    >
      <Image
        src="/kakao-logo.svg"
        alt="카카오 로고"
        className="size-32"
        width={32}
        height={32}
      />
      간편로그인해서 게임 만들기
    </SecondaryOutlineBoxButton>
  )
}
