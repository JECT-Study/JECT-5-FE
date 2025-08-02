import { GameCreationProvider } from "../../entities/game/model/state/create/gameCreationContext"
import { CreateGameNavigation } from "../../entities/game/ui/components/createGameNavigation"
import { FileUploadArea } from "../../entities/game/ui/components/fileUploadArea"
import { QuestionInputForm } from "../../entities/game/ui/components/questionInputForm"
import { QuestionList } from "../../entities/game/ui/components/questionList"
import { PopupManager } from "../../entities/game/ui/popupManager"

export default function CreateGamePage() {
  return (
    <GameCreationProvider>
      <PopupManager>
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
      </PopupManager>
    </GameCreationProvider>
  )
}
