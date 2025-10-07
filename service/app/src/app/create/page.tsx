"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

import { GameCreationProvider } from "../../entities/game/model/state/create/gameCreationContext"
import { CreateGameNavigation } from "../../entities/game/ui/components/createGameNavigation"
import { FileUploadArea } from "../../entities/game/ui/components/fileUploadArea"
import { QuestionInputForm } from "../../entities/game/ui/components/questionInputForm"
import { QuestionList } from "../../entities/game/ui/components/questionList"

function CreateGameContent() {
  return (
    <main className="min-h-screen bg-background-primary">
      <CreateGameNavigation />
      <div className="flex">
        <QuestionList />

        <div className="flex flex-1 items-start justify-center pt-[40px]">
          <FileUploadArea />
        </div>

        <div className="w-[420px] pr-[284px] pt-[40px]">
          <QuestionInputForm />
        </div>
      </div>
    </main>
  )
}

function CreateGamePageContent() {
  const searchParams = useSearchParams()
  const gameId = searchParams.get("gameId")

  return (
    <GameCreationProvider gameId={gameId}>
      <CreateGameContent />
    </GameCreationProvider>
  )
}

const CreateGamePageSkeleton = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-primary">
      <div className="text-center">
        <div className="mb-4">페이지를 준비하고 있습니다</div>
        <div className="mx-auto size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    </div>
  )
}

export default function CreateGamePage() {
  return (
    <Suspense fallback={<CreateGamePageSkeleton />}>
      <CreateGamePageContent />
    </Suspense>
  )
}
