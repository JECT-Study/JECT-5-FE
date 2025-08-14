"use client"

import { useSearchParams } from "next/navigation"

import { GameCreationProvider } from "../../entities/game/model/state/create/gameCreationContext"
import { CreateGameNavigation } from "../../entities/game/ui/components/createGameNavigation"
import { FileUploadArea } from "../../entities/game/ui/components/fileUploadArea"
import { QuestionInputForm } from "../../entities/game/ui/components/questionInputForm"
import { QuestionList } from "../../entities/game/ui/components/questionList"

function CreateGameContent() {

  return (
    <main className="min-h-screen bg-neutral-white">
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

export default function CreateGamePage() {
  const searchParams = useSearchParams()
  const gameId = searchParams.get("gameId")

  return (
    <GameCreationProvider gameId={gameId}>
      <CreateGameContent />
    </GameCreationProvider>
  )
}
