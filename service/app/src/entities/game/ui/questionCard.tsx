import {
  DestructiveSolidIconButton,
  SecondaryPlainIconButton,
} from "@shared/design/src/components/button"
import { Arrow, Trash } from "@shared/design/src/icons"

export function QuestionCard() {
  return (
    <div className="relative w-[350px] h-[118px] rounded-[10px] border-2 border-border-interactive-primary bg-background-primary">
      <div className="absolute left-5 top-6 w-[173px]">
        <p className="typography-heading-sm-medium text-text-primary line-clamp-1">
        질문가나다라마바사가나다라마바사가나다라마바사
        </p>
      </div>

      <div className="absolute left-3.5 bottom-4">
        <DestructiveSolidIconButton size="small">
          <Trash />
        </DestructiveSolidIconButton>
      </div>


      <div className="absolute right-[18px] top-5 flex items-center gap-3">
        <div className="w-[78px] h-[78px] rounded-[7px] overflow-hidden bg-background-interactive-secondary">
          <img 
            src="/checker.svg"
            alt="Question checker image" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex flex-col gap-[22px] w-7">
          <SecondaryPlainIconButton size="md" className="w-7 h-7">
            <Arrow />
          </SecondaryPlainIconButton>
          <SecondaryPlainIconButton size="md" className="w-7 h-7">
            <Arrow className="rotate-180" />
          </SecondaryPlainIconButton>
        </div>
      </div>
    </div>
  )
} 