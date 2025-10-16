"use client"

import type { ReactNode } from "react"
import { Suspense } from "react"

import CreateGamePageSkeleton from "./loading"
import { CreateGameProvider } from "./store"

export default function CreateGameLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <Suspense fallback={<CreateGamePageSkeleton />}>
      <CreateGameProvider>{children}</CreateGameProvider>
    </Suspense>
  )
}
