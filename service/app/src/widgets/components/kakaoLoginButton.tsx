import { SecondaryOutlineBoxButton } from "@shared/design/src/components/button"
import Image from "next/image"
import { useRouter } from "next/navigation"

export const KakaoLoginButton = () => {
  const router = useRouter()

  const handleLogin = async () => {
    router.push("/login")
  }

  return (
    <SecondaryOutlineBoxButton size="md" onClick={handleLogin}>
      <Image
        src="/kakao-logo.svg"
        alt="카카오 로고"
        className="size-8"
        width={32}
        height={32}
      />
      간편로그인해서 게임 만들기
    </SecondaryOutlineBoxButton>
  )
}
