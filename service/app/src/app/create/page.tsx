import { CreateGameNavigation } from "../../entities/game/ui/createGameNavigation"
import { QuestionList } from "../../entities/game/ui/questionList"
import { QuestionInputForm } from "../../entities/game/ui/questionInputForm"
import { FileUploadArea } from "../../entities/game/ui/fileUploadArea"

export default function CreateGamePage() {
  return (
    <main className="min-h-screen bg-neutral-white">
      <CreateGameNavigation />
      <div className="flex">
        <QuestionList />
        <div className="flex-1 p-6">
          <FileUploadArea />
          <div className="mt-[54px]">
            <QuestionInputForm />
          </div>
        </div>
      </div>
    </main>
  )
} 