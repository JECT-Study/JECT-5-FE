import Script from "next/script"
import type { ReactNode } from "react"

import { getGameDetail } from "@/entities/game/api/getGameDetail"

import { GameProvider } from "./store/gameProvider"

export default async function GameLayout({
  params,
  children,
}: {
  params: { gameId: string }
  children: ReactNode
}) {
  const gameDetail = await getGameDetail(params.gameId)

  // 이미지 URL 추출
  const imageUrls =
    gameDetail.data.questions?.map((q) => q.imageUrl).filter(Boolean) || []

  return (
    <GameProvider initialGameDetail={gameDetail.data} gameId={params.gameId}>
      {/* Script로 프리로드 */}
      <Script id="preload-game-images" strategy="afterInteractive">
        {`
          (function() {
            
            // 이미지 URL들
            const imageUrls = ${JSON.stringify(imageUrls)};
            
            // 프리로드 함수
            function preloadImage(url) {
              const img = new Image();
              img.src = url;
            }
            
            // 모든 이미지 프리로드
            imageUrls.forEach(url => {
              if (url) preloadImage(url);
            });
            
          })();
        `}
      </Script>

      <div className="flex h-screen w-screen flex-col bg-background-primary">
        {children}
      </div>
    </GameProvider>
  )
}
