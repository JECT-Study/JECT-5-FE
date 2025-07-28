import { CreateGameNavigation } from "../../entities/game/ui/createGameNavigation"
import { QuestionList } from "../../entities/game/ui/questionList"

export default function CreateGamePage() {
  return (
    <main className="min-h-screen bg-neutral-white">
      <CreateGameNavigation />
      <div className="flex">
        <QuestionList />
      </div>
    </main>
  )
} 