import { CreateGameNavigation } from "../../entities/game/ui/createGameNavigation"
import { FileUploadArea } from "../../entities/game/ui/fileUploadArea"
import { QuestionInputForm } from "../../entities/game/ui/questionInputForm"
import { QuestionList } from "../../entities/game/ui/questionList"

export default function CreateGamePage() {
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