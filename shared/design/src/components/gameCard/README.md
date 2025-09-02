# GameCard 컴포넌트 - Radix UI 기반 컴포넌트 구조

## 🏗️ Radix UI 기반 컴포넌트 구조

GameCard 컴포넌트는 내부적으로 여러 Radix UI 기반 컴포넌트들을 사용하여 구성되어 있습니다.

### 1. **BaseButton (Radix UI Slot 기반)**

모든 버튼 컴포넌트의 기반이 되는 `BaseButton`은 Radix UI의 `Slot` primitive를 사용합니다:

```typescript
// shared/design/src/components/button/baseButton.tsx
import { Slot } from "radix-ui"
import { type ComponentPropsWithoutRef, forwardRef } from "react"

export type BaseButtonProps = ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean
}

export const BaseButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  ({ asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : "button"
    return <Comp ref={ref} data-slot="button" {...props} />
  },
)
```

### 2. **SecondaryPlainIconButton**

GameCardOptions의 트리거 버튼에서 사용되는 컴포넌트로, `BaseButton`을 확장합니다:

```typescript
// shared/design/src/components/button/secondaryPlainIconButton.tsx
import { BaseButton, type BaseButtonProps } from "./baseButton"

export interface SecondaryPlainIconButtonProps
  extends BaseButtonProps,
    VariantProps<typeof secondaryPlainIconButtonVariants> {}

const SecondaryPlainIconButton = React.forwardRef<
  ElementRef<typeof BaseButton>,
  SecondaryPlainIconButtonProps
>(({ className, size, ...props }, ref) => {
  return (
    <BaseButton
      className={cn(secondaryPlainIconButtonVariants({ size }), className)}
      ref={ref}
      {...props}
    />
  )
})
```

**GameCardOptions에서 사용:**
```tsx
// GameCardOptions 트리거 버튼
<SecondaryPlainIconButton
  aria-label="게임 옵션"
  onClick={(e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
  }}
>
  <MoreDot />
</SecondaryPlainIconButton>
```

### 3. **Radix UI DropdownMenu 기반 메뉴 시스템**

GameCardOptions의 드롭다운 메뉴는 Radix UI의 `DropdownMenu` primitive를 기반으로 구현됩니다:

```typescript
// shared/design/src/components/menu/index.tsx
import { DropdownMenu } from "radix-ui"

const DropdownMenuRoot = DropdownMenu.Root

const DropdownMenuTrigger = DropdownMenu.Trigger

const DropdownMenuContent = forwardRef<
  React.ElementRef<typeof DropdownMenu.Content>,
  ComponentPropsWithoutRef<typeof DropdownMenu.Content> & MenuType
>(({ className, type = "vertical", contentType, sideOffset = 4, ...props }, ref) => {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        ref={ref}
        className={cn(menuVariants({ type, contentType }), className)}
        sideOffset={sideOffset}
        {...props}
      />
    </DropdownMenu.Portal>
  )
})

const DropdownMenuItem = forwardRef<
  React.ElementRef<typeof DropdownMenu.Item>,
  ComponentPropsWithoutRef<typeof DropdownMenu.Item> & MenuItemType
>(({ className, type = "text", ...props }, ref) => {
  return (
    <DropdownMenu.Item
      ref={ref}
      className={cn(menuItemVariants({ type }), className)}
      {...props}
    />
  )
})
```

**GameCardOptions에서 사용:**
```tsx
// GameCardOptions 드롭다운 메뉴 구현
<DropdownMenuRoot>
  <DropdownMenuTrigger asChild>
    <SecondaryPlainIconButton aria-label="게임 옵션">
      <MoreDot />
    </SecondaryPlainIconButton>
  </DropdownMenuTrigger>
  <DropdownMenuContent type="horizontal" contentType="icon">
    <DropdownMenuItem type="icon" onClick={onEdit}>
      <Edit />
      <span>게임 수정</span>
    </DropdownMenuItem>
    <DropdownMenuItem type="icon" onClick={onShare}>
      <Upload />
      <span>게임 공유</span>
    </DropdownMenuItem>
    <DropdownMenuItem type="icon" onClick={onDelete}>
      <Trash />
      <span>게임 삭제</span>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenuRoot>
```

## 📊 컴포넌트 계층 구조

```
GameCard
├── GameCard.Image      (이미지 컨테이너)
├── GameCard.Title      (제목 텍스트)
├── GameCard.Badge      (문제 수 배지)
└── GameCard.SharedBadge (공유 배지)

GameCardOptions (별도 컴포넌트)
├── SecondaryPlainIconButton (트리거)
│   └── BaseButton (Radix UI Slot 기반)
└── DropdownMenu (Radix UI 기반)
    ├── DropdownMenuRoot
    ├── DropdownMenuTrigger
    ├── DropdownMenuContent
    └── DropdownMenuItem
```

### 추가 연관 컴포넌트
- **GameCardOptions**: MoreDot 드롭다운 메뉴 (별도 컴포넌트)

## ♿ GameCard 컴포넌트 접근성 속성 상세 설명

### 1. **GameCardComponent 컴포넌트의 접근성 속성**

```tsx
<div
  role="group"
  aria-label={accessibleName}
  className="..."
>
  {children}
</div>
```

#### `role="group"`
- **목적**: 게임 카드를 논리적으로 관련된 요소들의 그룹으로 정의
- **이유**: 게임 이미지, 제목, 배지들이 하나의 게임 단위를 구성한다는 것을 명시적으로 표현
- **E2E 테스트**: `page.getByRole('group')` 선택자로 게임 카드를 안정적으로 찾을 수 있음

#### `aria-label={accessibleName}`
- **목적**: 각 게임 카드를 구체적으로 구분할 수 있는 접근 가능한 이름 제공
- **값**: `title ? \`${title} 게임 카드\` : "게임 카드"`
- **이유**: 
  - **게임별 식별**: 게임 제목 기반으로 각 카드를 명확히 구분
  - **선택적 라벨링**: `title` prop이 제공된 경우에만 구체적인 이름 사용
  - **E2E 테스트 용이성**: 게임 이름으로 특정 카드를 안정적으로 선택 가능
- **E2E 테스트**: `page.getByRole('group', { name: '퀴즈 게임 게임 카드' })`로 특정 게임 선택

### 2. **Badge 컴포넌트들의 접근성 속성**

#### GameCardBadge (문제 수 배지)
```tsx
<div
  aria-label="문제 수 배지"
  className="..."
>
  <span>{children}</span>
</div>
```

#### GameCardSharedBadge (공유 배지)
```tsx
<div
  role="status"
  aria-label="공유 배지"
  className="..."
>
  <span>{children}</span>
</div>
```

#### `role="status"`
- **목적**: 배지가 게임의 현재 상태나 속성을 나타내는 정보임을 명시
- **이유**: 
  - **정보 전달**: 시각적 배지가 전달하는 정보를 접근성 사용자에게도 제공
  - **실시간 업데이트**: 게임 정보 변경 시 스크린 리더가 자동으로 알림
- **WAI-ARIA 표준**: `status` role은 동적으로 업데이트되는 상태 정보에 적합

#### `aria-label` 속성 (배지 컴포넌트)
- **목적**: 시각적 배지 내용을 명확한 텍스트로 설명
- **값**: 
  - 문제 수 배지: `"문제 수 배지"` (고정값)
  - 공유 배지: `"공유 배지"` (고정값)
- **이유**:
  - **컨텍스트 제공**: 단순한 숫자나 텍스트에 의미적 맥락 추가
  - **일관성**: 모든 배지에 동일한 패턴의 설명 제공
  - **E2E 테스트**: `page.getByRole('status', { name: '문제 수: 10문제' })`로 특정 배지 확인

## 🔄 Figma 디자인 대비 리팩토링 변경사항

현재 GameCard 컴포넌트는 원본 Figma 디자인에서 크게 리팩토링되었습니다. 주요 변경사항과 그 이유를 설명합니다.

### 📐 **원본 Figma 구조**

Figma의 GameCard 컴포넌트 세트는 다음과 같이 구성되어 있었습니다:

```
COMPONENT_SET "gameCard"
├── COMPONENT "type=libraryGame, optionView=false"      (178×236px)
├── COMPONENT "type=myGame, optionView=false"           (178×236px)  
├── COMPONENT "type=myGame, optionView=true"            (178×298px)
├── COMPONENT "type=gamePreview, optionView=false"      (178×318px)
└── COMPONENT "type=onlyTitleGamePreview, optionView=false" (178×46px)
```

**Figma 구조의 특징:**
- **타입 기반 배리언트**: `type` × `optionView` 조합으로 5개의 고정 배리언트
- **절대 위치 기반**: 각 요소가 절대 위치로 배치 (`x`, `y` 좌표)
- **고정 레이아웃**: `layoutMode="NONE"` 또는 `HORIZONTAL`로 제한적 구조
- **옵션 메뉴 내장**: `optionView=true`일 때 드롭다운 메뉴가 컴포넌트에 포함

### 🔧 **리팩토링된 현재 구조**

현재 구현은 **Compound Component Pattern**을 사용한 유연한 구조로 변경되었습니다:

```typescript
// 현재 구현
<GameCard>
  <GameCard.Image>
    <img src="/image.jpg" alt="게임 이미지" />
    <GameCard.Badge>10문제</GameCard.Badge>
    <GameCard.SharedBadge>공유</GameCard.SharedBadge>
  </GameCard.Image>
  <GameCard.Title>게임 제목</GameCard.Title>
</GameCard>

// Dashboard용 옵션 버튼 포함
<GameCard>
  <GameCard.Image>...</GameCard.Image>
  {isDashboard ? (
    <div className="flex items-center justify-between">
      <GameCard.Title>게임 제목</GameCard.Title>
      <GameCardOptions />
    </div>
  ) : (
    <GameCard.Title>게임 제목</GameCard.Title>
  )}
</GameCard>
```

### 🎯 **주요 변경사항과 이유**

#### 1. **Compound Component Pattern 도입**

**변경 전 (Figma):**
```
- 5개의 고정 배리언트
- type과 optionView 조합으로만 사용 가능
- 내부 구조 변경 불가
```

**변경 후 (현재):**
```typescript
// 유연한 조합 가능
<GameCard>
  <GameCard.Image>
    <CustomImage />
    <GameCard.Badge>15문제</GameCard.Badge>
  </GameCard.Image>
  <CustomTitleComponent />  // 사용자 정의 제목 컴포넌트
</GameCard>
```

**이유:**
- **확장성**: 새로운 요구사항에 맞춰 유연하게 조합 가능
- **재사용성**: 부분적으로 다른 구성이 필요한 경우 대응 가능
- **유지보수성**: 개별 하위 컴포넌트를 독립적으로 수정 가능

#### 2. **타입 시스템 단순화**

**변경 전 (Figma):**
```
- type=libraryGame|myGame|gamePreview|onlyTitleGamePreview (고정)
- optionView=true|false (고정)
- 5개 배리언트로만 제한
```

**변경 후 (현재):**
```typescript
interface GameCardProps {
  children: ReactNode
  className?: string
  title?: string    // 선택적 접근성 라벨
  onClick?: () => void  // 인터랙션 지원
}
```

**이유:**
- **단순성**: 복잡한 타입 조합 대신 props 기반 설정
- **동적 구성**: 런타임에 구조 변경 가능
- **선택적 기능**: 필요한 경우에만 특정 기능 활성화

#### 3. **옵션 메뉴 분리**

**변경 전 (Figma):**
```
- optionView=true일 때 드롭다운 메뉴가 컴포넌트에 내장
- 고정된 메뉴 구조와 위치
```

**변경 후 (현재):**
```typescript
// 별도 컴포넌트로 분리
<GameCardOptions
  shared={game.isShared}
  onEdit={() => onEdit(game)}
  onShare={() => onShare(game)}
  onDelete={() => onDelete(game)}
/>
```

**이유:**
- **관심사 분리**: 게임 카드 표시와 옵션 기능을 독립적으로 관리
- **재사용성**: 다른 컴포넌트에서도 동일한 옵션 메뉴 사용 가능
- **접근성**: Radix UI 기반으로 완벽한 키보드 네비게이션과 ARIA 지원

#### 4. **이미지 처리 방식 개선**

**변경 전 (Figma):**
```
- 고정된 이미지 크기와 위치
- 178×178px (기본) 또는 178×260px (preview)
```

**변경 후 (현재):**
```typescript
// shared/design 패키지에서는 일반 img 태그 사용 (Next.js 독립적)
<GameCard.Image>
  <img 
    src="/game-image.jpg"
    alt="게임 이미지"
    className="size-[178px] rounded-[10px] object-cover"
  />
</GameCard.Image>

// service/app에서 Next.js Image 사용 시
<GameCard.Image>
  <Image 
    src="/game-image.jpg"
    alt="게임 이미지"
    width={178}
    height={178}
    className="rounded-[10px] object-cover"
    priority
  />
</GameCard.Image>

// 커스텀 크기 지원
<GameCard.Image className="h-[260px]">
  <img src="/preview.jpg" alt="미리보기" />
</GameCard.Image>
```

**이유:**
- **패키지 독립성**: shared/design은 Next.js에 의존하지 않는 순수 React 컴포넌트
- **유연성**: 일반 img 태그와 Next.js Image 모두 주입 가능
- **프레임워크 중립**: 다른 React 기반 프레임워크에서도 재사용 가능
- **크기 커스터마이징**: className을 통한 다양한 이미지 크기 지원

#### 5. **배지 시스템 개선**

**변경 전 (Figma):**
```
- 고정된 위치의 "10문제" 배지
- 공유 상태에 따른 별도 배지 없음
```

**변경 후 (현재):**
```typescript
// 동적 문제 수와 공유 상태 표시
<GameCard.Image>
  <img src="..." alt="..." />
  <GameCard.Badge className="left-[8px] top-[8px]">
    {game.questionCount}문제
  </GameCard.Badge>
  {game.isShared && (
    <GameCard.SharedBadge>공유</GameCard.SharedBadge>
  )}
</GameCard.Image>
```

**이유:**
- **동적 데이터**: 실제 게임 데이터에 따른 문제 수 표시
- **조건부 렌더링**: 공유 상태에 따른 배지 표시/숨김
- **위치 조정**: className을 통한 배지 위치 커스터마이징
- **접근성**: `role="status"`와 `aria-label`로 스크린 리더 지원

#### 6. **사용 예시 변경**

**변경 전 (Figma):**
```typescript
<GameCardComponent variant="type=myGame,optionView=true" />
```

**변경 후 (현재):**
```typescript
// 기본 게임 카드
<GameCard onClick={() => handleGameClick(game)}>
  <GameCard.Image>
    <Image src={game.thumbnail} alt={game.title} width={178} height={178} />
    <GameCard.Badge>{game.questionCount}문제</GameCard.Badge>
    {game.isShared && <GameCard.SharedBadge>공유</GameCard.SharedBadge>}
  </GameCard.Image>
  <GameCard.Title>{game.title}</GameCard.Title>
</GameCard>

// Dashboard 스타일 (옵션 버튼 포함)
<GameCard title={game.title}>
  <GameCard.Image>...</GameCard.Image>
  {isDashboard ? (
    <div className="flex items-center justify-between">
      <div className="w-[130px]">
        <GameCard.Title>{game.title}</GameCard.Title>
      </div>
      <GameCardOptions 
        shared={game.isShared}
        onEdit={() => handleEdit(game)}
        onShare={() => handleShare(game)}
        onDelete={() => handleDelete(game)}
      />
    </div>
  ) : (
    <GameCard.Title>{game.title}</GameCard.Title>
  )}
</GameCard>
```

**접근성 라벨 결과:**
- GameCard: `aria-label="퀴즈 게임 게임 카드"` (title prop 제공 시)
- Badge: `aria-label="문제 수: 10문제"`
- SharedBadge: `aria-label="공유 배지"`
- OptionsButton: `aria-label="게임 옵션"`

## 🎨 현재 구현의 장점

### 1. **유연성과 확장성**
- Compound Component로 자유로운 조합
- 새로운 하위 컴포넌트 추가 용이
- 다양한 레이아웃 요구사항 대응

### 2. **접근성 우선 설계**
- E2E 테스트를 위한 안정적인 선택자
- 스크린 리더 호환성
- 키보드 네비게이션 지원

### 3. **프레임워크 독립성**
- shared/design 패키지의 순수 React 구현
- Next.js Image와 일반 img 태그 모두 지원
- 다른 React 프레임워크에서 재사용 가능

### 4. **관심사 분리**
- 게임 카드 표시와 옵션 기능 분리
- 각 하위 컴포넌트의 독립적 관리
- 명확한 책임 경계

