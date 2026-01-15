import { getGameDetail } from "@/entities/game"

import { GameNavigation } from "./components/gameNavigation"
import { TeamInputForm } from "./components/teamInputForm"
import { TeamSidebar } from "./components/teamSidebar"

export async function generateMetadata({
  params,
}: {
  params: { gameId: string }
}) {
  const { data: game } = await getGameDetail(params.gameId)
  return {
    title: `${game.gameTitle} - Re:creation`,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: game.gameTitle,
      type: "website",
      locale: "ko_KR",
      images: [
        {
          url: `/og/og-${params.gameId}.png`,
          width: 1200,
          height: 630,
          alt: game.gameTitle,
          type: "image/png",
        },
      ],
    },
  }
}

export default function GameSetupPage() {
  return (
    <>
      <GameNavigation />
      <section className="flex flex-1 overflow-hidden">
        <TeamSidebar />
        <div className="flex h-full flex-1 flex-col items-center justify-center">
          <div className="flex max-h-full min-w-[452px] flex-col items-center justify-start overflow-y-auto">
            <TeamInputForm />
          </div>
        </div>
      </section>
    </>
  )
}
