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
        
        <div className="flex-1 flex justify-center items-start pt-[40px]">
          <FileUploadArea />
        </div>
        
        <div className="w-[420px] pt-[40px] pr-[284px]">
          <QuestionInputForm />
        </div>
      </div>
    </main>
  )
} 