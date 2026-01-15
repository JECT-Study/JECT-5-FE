import { Metadata } from "next"

import { GameSection } from "@/app/_components/GameSection/GameSection"
import { HeroSection } from "@/app/_components/HeroSection"
import { HomeNavigation } from "@/widgets/HomeNavigation"

export const metadata: Metadata = {
  title: "Re:creation - 모두 함께 즐기는 레크레이션",
  description:
    "MT, 워크샵, 소모임을 위한 인물 퀴즈, 명대사 퀴즈, 줄줄이 말해요 등 다양한 레크레이션 게임을 만들고 즐길 수 있습니다.",
  keywords: [
    "레크레이션",
    "아이스 브레이킹",
    "레크레이션 게임",
    "실내 게임 25가지 레크레이션",
    "신서유기 게임",
    "이름 맞추기",
    "퀴즈 사이트",
    "엠티 레크레이션",
    "기업 레크레이션",
    "레크레이션 피피티",
  ],
  openGraph: {
    title: "Re:creation - 모두 함께 즐기는 레크레이션",
    description:
      "MT, 워크숍, 소모임에서 바로 사용할 수 있는 라이트 레크리에이션. 인물퀴즈, 명대사퀴즈 등 다양한 게임으로 분위기를 띄워보세요.",
    url: "https://re-creation.vercel.app",
    siteName: "Re:creation",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Re:creation - 모두 함께 즐기는 레크레이션",
        type: "image/png",
      },
    ],
  },
}

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background-primary">
      <HomeNavigation />
      <div className="flex flex-col gap-56">
        <HeroSection />
        <GameSection />
      </div>
    </main>
  )
}

export const dynamic = "force-dynamic"
