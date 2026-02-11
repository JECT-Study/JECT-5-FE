import { getImageProps } from "next/image"
import type { ReactNode } from "react"
import { preload } from "react-dom"

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

  // 모든 질문 이미지 프리로드
  gameDetail.data.questions.forEach((question, idx) => {
    if (question.imageUrl) {
      const { props } = getImageProps({
        src: question.imageUrl,
        width: 600,
        height: 400,
        alt: `${idx + 1}번째 문제 이미지`,
      })
      preload(props.src, {
        as: "image",
        imageSrcSet: props.srcSet,
        imageSizes: props.sizes,
      })
    }
  })

  return (
    <GameProvider initialGameDetail={gameDetail.data}>
      <div className="flex h-screen w-screen flex-col bg-background-primary pt-[90px]">
        {children}
      </div>
    </GameProvider>
  )
}
