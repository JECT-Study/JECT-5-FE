"use client"

import { useSearchParams } from "next/navigation"

import { GameCreationProvider } from "../../entities/game/model/state/create/gameCreationContext"
import { CreateGameNavigation } from "../../entities/game/ui/components/createGameNavigation"
import { FileUploadArea } from "../../entities/game/ui/components/fileUploadArea"
import { QuestionInputForm } from "../../entities/game/ui/components/questionInputForm"
import { QuestionList } from "../../entities/game/ui/components/questionList"

function CreateGameContent() {
  return (
    <div className="flex">
      <QuestionList />
      <div className="flex w-full flex-col">
        <CreateGameNavigation />
        <div className="flex justify-center gap-40">
          <FileUploadArea />
          <QuestionInputForm />
        </div>
      </div>
    </div>
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

export default function CreateGamePage() {
  return <CreateGamePageContent />
}
