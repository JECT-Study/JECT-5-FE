import { GameNavigation } from "./components/gameNavigation"
import { TeamInputForm } from "./components/teamInputForm"
import { TeamSidebar } from "./components/teamSidebar"

export default function GameSetupPage() {
  return (
    <>
      <GameNavigation />
      <section className="flex flex-1 overflow-hidden">
        <TeamSidebar />
        <div className="flex h-full flex-1 flex-col items-center justify-center">
          <div className="flex max-h-full min-w-[452px] flex-col items-center justify-start overflow-y-auto">
            <TeamInputForm />
          </div>
        </div>
      </section>
    </>
  )
}
