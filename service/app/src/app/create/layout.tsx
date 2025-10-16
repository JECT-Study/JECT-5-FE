"use client"

import { useSearchParams } from "next/navigation"
import type { ReactNode } from "react"

import { CreateGameProvider } from "./store/createGameProvider"

export default function CreateGameLayout({
  children,
}: {
  children: ReactNode
}) {
  const searchParams = useSearchParams()
  const gameId = searchParams.get("gameId")

  return <CreateGameProvider gameId={gameId}>{children}</CreateGameProvider>
}
