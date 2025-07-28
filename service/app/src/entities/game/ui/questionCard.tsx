import {
  DestructiveSolidIconButton,
  SecondaryPlainIconButton,
} from "@shared/design/src/components/button"
import { Arrow, Trash } from "@shared/design/src/icons"

interface QuestionCardProps {
  state?: 'default' | 'selected' | 'error'
  hasImage?: boolean
  question?: string
  imageSrc?: string
  onDelete?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
}

export function QuestionCard({
  state = 'default',
  hasImage = true,
  question = "질문가나다라마바사가나다라마바사가나다라마바사",
  imageSrc = "/checker.svg",
  onDelete,
  onMoveUp,
  onMoveDown,
}: QuestionCardProps) {
  const getBorderClass = () => {
    switch (state) {
      case 'selected':
        return 'border-2 border-border-interactive-primary'
      case 'error':
        return 'border-2 border-border-interactive-destructive'
      default:
        return 'border-2 border-border-interactive-secondary'
    }
  }

  const getTextClass = () => {
    const baseClass = "typography-heading-sm-medium text-text-primary line-clamp-1"
    return baseClass
  }

  const getTextWidth = () => {
    return hasImage ? "w-[173px]" : "w-[266px]"
  }

  return (
    <div className={`relative w-[350px] h-[118px] rounded-[10px] ${getBorderClass()} bg-background-primary`}>
      <div className={`absolute left-5 top-6 ${getTextWidth()}`}>
        <p className={getTextClass()}>
          {state === 'error' ? '❗' : question}
        </p>
      </div>

      <div className="absolute left-3.5 bottom-4">
        <DestructiveSolidIconButton size="small" onClick={onDelete}>
          <Trash />
        </DestructiveSolidIconButton>
      </div>

      {hasImage && (
        <div className="absolute right-[18px] top-5 flex items-center gap-3">
          <div className="w-[78px] h-[78px] rounded-[7px] overflow-hidden bg-background-interactive-secondary">
            <img 
              src={imageSrc}
              alt="Question checker image" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex flex-col gap-[22px] w-7">
            <SecondaryPlainIconButton size="md" className="w-7 h-7" onClick={onMoveUp}>
              <Arrow />
            </SecondaryPlainIconButton>
            <SecondaryPlainIconButton size="md" className="w-7 h-7" onClick={onMoveDown}>
              <Arrow className="rotate-180" />
            </SecondaryPlainIconButton>
          </div>
        </div>
      )}

      {!hasImage && (
        <div className="absolute right-[18px] top-5 flex items-center gap-3">
          <div className="flex flex-col gap-[22px] w-7">
            <SecondaryPlainIconButton size="md" className="w-7 h-7" onClick={onMoveUp}>
              <Arrow />
            </SecondaryPlainIconButton>
            <SecondaryPlainIconButton size="md" className="w-7 h-7" onClick={onMoveDown}>
              <Arrow className="rotate-180" />
            </SecondaryPlainIconButton>
          </div>
        </div>
      )}
    </div>
  )
} 