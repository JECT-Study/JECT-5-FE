import {
  DestructiveSolidBoxButton,
  PrimaryBoxButton,
} from "@ject-5-fe/design/components/button"
import {
  Control as InputControl,
  Field as InputField,
  Root as InputRoot,
} from "@ject-5-fe/design/components/input"

interface UsersPageHeaderProps {
  onBlock?: () => void
  onUnblock?: () => void
}

export const UsersPageHeader = ({
  onBlock,
  onUnblock,
}: UsersPageHeaderProps) => {
  return (
    <div className="flex w-full items-center gap-300">
      <div className="flex w-full items-center gap-40">
        <h1 className="typography-heading-2xl-extrabold shrink-0 text-text-secondary">
          사용자 관리
        </h1>
        <InputRoot className="w-full">
          <InputField
            className="w-full rounded-8 border-2 border-border-interactive-input-default"
            type="leftIcon"
            state="default"
            name="admin-user-search"
          >
            <InputControl placeholder="이름 또는 이메일 검색" />
          </InputField>
        </InputRoot>
      </div>
      <div className="flex shrink-0 gap-16">
        <DestructiveSolidBoxButton size="lg" onClick={onBlock}>
          차단
        </DestructiveSolidBoxButton>
        <PrimaryBoxButton size="lg" onClick={onUnblock}>
          차단 해제
        </PrimaryBoxButton>
      </div>
    </div>
  )
}
