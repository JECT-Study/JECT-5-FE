# Question 컴포넌트 - Radix UI 기반 컴포넌트 구조

## 🏗️ Radix UI 기반 컴포넌트 구조

Question 컴포넌트는 내부적으로 여러 Radix UI 기반 컴포넌트들을 사용하여 구성되어 있습니다.

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

### 2. **DestructiveSolidIconButton**

Question 컴포넌트의 삭제 버튼에서 사용되는 컴포넌트로, `BaseButton`을 확장합니다:

```typescript
// shared/design/src/components/button/destructiveSolidIconButton.tsx
import { BaseButton, type BaseButtonProps } from "./baseButton"

interface DestructiveSolidIconButtonProps
  extends BaseButtonProps,
    DestructiveSolidIconButtonVariantProps {
  children: React.ReactNode
}

export const DestructiveSolidIconButton = forwardRef<
  ElementRef<typeof BaseButton>,
  DestructiveSolidIconButtonProps
>(({ size, className, children, ...props }, ref) => {
  return (
    <BaseButton
      ref={ref}
      className={cn(destructiveSolidIconButtonVariants({ size }), className)}
      {...props}
    >
      {children}
    </BaseButton>
  )
})
```

**Question 컴포넌트에서 사용:**
```tsx
// Question.DeleteButton에서 사용
<DestructiveSolidIconButton
  onClick={(e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onDelete?.()
  }}
  disabled={!canDelete}
  aria-label={deleteLabel}
  size="md"
>
  <Trash />
</DestructiveSolidIconButton>
```

### 3. **SecondaryPlainIconButton**

Question 컴포넌트의 이동 버튼들에서 사용되는 컴포넌트로, 마찬가지로 `BaseButton`을 확장합니다:

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

**Question 컴포넌트에서 사용:**
```tsx
// Question.MoveButtons에서 사용
<SecondaryPlainIconButton
  onClick={(e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onMoveUp?.()
  }}
  size="md"
  aria-label={upLabel}
>
  <Arrow />
</SecondaryPlainIconButton>

<SecondaryPlainIconButton
  onClick={(e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onMoveDown?.()
  }}
  size="md"
  aria-label={downLabel}
>
  <Arrow className="rotate-180" />
</SecondaryPlainIconButton>
```

## 📊 컴포넌트 계층 구조

```
Question
├── Question.DeleteButton
│   └── DestructiveSolidIconButton
│       └── BaseButton (Radix UI Slot 기반)
└── Question.MoveButtons
    ├── SecondaryPlainIconButton (위로 이동)
    │   └── BaseButton (Radix UI Slot 기반)
    └── SecondaryPlainIconButton (아래로 이동)
        └── BaseButton (Radix UI Slot 기반)
```

## ♿ Question 컴포넌트 접근성 속성 상세 설명

### 1. **QuestionRoot 컴포넌트의 접근성 속성**

```tsx
<div
  role="group"
  aria-label={accessibleName}
  data-state={state}
  className="..."
  onClick={onClick}
>
```

#### `role="group"`
- **목적**: 질문 카드를 논리적으로 관련된 요소들의 그룹으로 정의
- **이유**: 질문 제목, 이미지, 버튼들이 하나의 질문 단위를 구성한다는 것을 명시적으로 표현
- **E2E 테스트**: `page.getByRole('group')` 선택자로 질문 카드를 안정적으로 찾을 수 있음

#### `aria-label={accessibleName}`
- **목적**: 각 질문 카드를 구체적으로 구분할 수 있는 접근 가능한 이름 제공
- **값**: `title ? \`질문: ${title}\` : "질문 카드"`
- **이유**: 
  - 스크린 리더 사용자가 어떤 질문인지 즉시 파악 가능
  - E2E 테스트에서 특정 질문을 정확히 선택 가능
- **E2E 테스트**: `page.getByRole('group', { name: '질문: 첫 번째 문제입니다' })`로 특정 질문 선택

#### `data-state={state}`
- **목적**: 질문의 현재 상태를 명시적으로 표현
- **값**: `"default" | "selected" | "error"`
- **이유**: 
  - Radix UI의 표준 패턴을 따라 상태 기반 스타일링 지원
  - E2E 테스트에서 상태별 질문 필터링 가능
  - `aria-selected`, `aria-invalid` 대신 사용하여 Radix UI와의 충돌 방지
- **E2E 테스트**: `page.locator('[data-state="selected"]')`로 선택된 질문들만 찾기

### 2. **Button 컴포넌트들의 접근성 속성**

#### DestructiveSolidIconButton (삭제 버튼)
```tsx
<DestructiveSolidIconButton
  aria-label={deleteLabel}
  // ...
>
  <Trash />
</DestructiveSolidIconButton>
```

#### SecondaryPlainIconButton (이동 버튼들)
```tsx
<SecondaryPlainIconButton
  aria-label={upLabel}
  // ...
>
  <Arrow />
</SecondaryPlainIconButton>
```

#### `aria-label` 속성 (모든 아이콘 버튼)
- **목적**: 텍스트가 없는 아이콘 버튼에 명확한 기능 설명 제공
- **값**: 
  - 삭제 버튼: `"${title} 질문 삭제"` 또는 `"질문 삭제"`
  - 위로 이동: `"${title} 질문 위로 이동"` 또는 `"질문 위로 이동"`
  - 아래로 이동: `"${title} 질문 아래로 이동"` 또는 `"질문 아래로 이동"`
- **이유**:
  - **아이콘만으로는 기능을 알 수 없음**: Trash, Arrow 아이콘만으로는 구체적인 동작을 파악하기 어려움
  - **스크린 리더 지원**: 시각적 정보에 의존할 수 없는 사용자를 위한 필수 정보
  - **구체적인 컨텍스트 제공**: 어떤 질문에 대한 동작인지 명확히 표시
  - **E2E 테스트 안정성**: 버튼의 시각적 위치나 아이콘 이미지가 변경되어도 기능 기반으로 선택 가능
- **E2E 테스트**: `page.getByRole('button', { name: '첫 번째 문제 질문 삭제' })`

### 3. **Radix UI와의 호환성 고려사항**

#### 제거된 속성들과 그 이유

**`aria-selected` (제거됨)**
- **문제**: HTML 표준에서 `aria-selected`는 주로 `option`, `tab`, `gridcell` 등에서 사용
- **해결**: `data-state="selected"`로 대체하여 Radix UI 패턴과 일치

**`aria-invalid` (제거됨)**
- **문제**: Form 컨텍스트가 아닌 일반 그룹 요소에는 부적절
- **해결**: `data-state="error"`로 대체하여 상태 표현

#### 유지된 속성들과 그 이유

**`aria-label` (버튼에서 유지)**
- **이유**: Radix UI의 BaseButton이 표준 HTML `<button>` 요소를 사용하므로 안전
- **근거**: HTML 표준에서 button 요소의 `aria-label`은 공식 지원 속성


## 🔄 Figma 디자인 대비 리팩토링 변경사항

현재 Question 컴포넌트는 원본 Figma 디자인에서 크게 리팩토링되었습니다. 주요 변경사항과 그 이유를 설명합니다.

### 📐 **원본 Figma 구조**

Figma의 Question 컴포넌트 세트는 다음과 같이 구성되어 있었습니다:

```
COMPONENT_SET "question"
├── COMPONENT "state=selected, image=true"   (350×118px)
├── COMPONENT "state=selected, image=false"  (350×118px)  
├── COMPONENT "state=error, image=true"      (350×118px)
├── COMPONENT "state=error, image=false"     (350×118px)
├── COMPONENT "state=default, image=true"    (350×118px)
└── COMPONENT "state=default, image=false"   (350×118px)
```

**Figma 구조의 특징:**
- **고정된 배리언트**: `state` × `image` 조합으로 6개의 고정 배리언트
- **절대 위치 기반**: 각 요소가 절대 위치로 배치 (`x`, `y` 좌표)
- **Figma 전용 속성**: `layoutMode="NONE"`, 절대 좌표 기반 레이아웃

### 🔧 **리팩토링된 현재 구조**

현재 구현은 **Compound Component Pattern**을 사용한 유연한 구조로 변경되었습니다:

```typescript
// 현재 구현
<Question state="default">
  <Question.Title>첫 번째 질문</Question.Title>
  <Question.Image>
    <img src="/image.jpg" alt="질문 이미지" />
  </Question.Image>
  <Question.DeleteButton onDelete={handleDelete} />
  <Question.MoveButtons onMoveUp={handleMoveUp} onMoveDown={handleMoveDown} />
</Question>
```

### 🎯 **주요 변경사항과 이유**

#### 1. **Compound Component Pattern 도입**

**변경 전 (Figma):**
```
- 6개의 고정 배리언트
- state와 image 조합으로만 사용 가능
- 내부 구조 변경 불가
```

**변경 후 (현재):**
```typescript
// 유연한 조합 가능
<Question state="selected">
  <Question.Title>질문 제목</Question.Title>
  <Question.Actions>
    <CustomButton />  // 사용자 정의 버튼 추가 가능
  </Question.Actions>
</Question>
```

**이유:**
- **확장성**: 새로운 요구사항에 맞춰 유연하게 조합 가능
- **재사용성**: 부분적으로 다른 구성이 필요한 경우 대응 가능
- **유지보수성**: 개별 하위 컴포넌트를 독립적으로 수정 가능

#### 2. **상태 관리 방식 변경**

**변경 전 (Figma):**
```
- state=default|selected|error (고정)
- image=true|false (고정)
- 6개 배리언트로만 제한
```

**변경 후 (현재):**
```typescript
interface QuestionRootProps {
  state: "default" | "selected" | "error"
  onClick?: () => void // 인터랙션 지원
  // image (boolean) 속성 삭제
}
```

**이유:**
- **동적 상태**: 런타임에 상태 변경 가능, `state="error"`로 에러 처리 통합
- **자동 접근성**: `Question.Title`에서 자동으로 접근성 라벨 생성
- **인터랙션**: 클릭 등 사용자 상호작용 지원
- 합성 컴포넌트 패턴으로 충분히 처리 가능한 불필요한 속성 (image) 삭제

#### 3. **이미지 처리 방식 개선**

**변경 후 (현재):**
```typescript
// shared/design 패키지에서는 일반 img 태그 사용 (Next.js 독립적)
<Question state="default">
  <Question.Image>
    <img 
      src="/question-images/sample.jpg"
      alt="질문 관련 이미지"
      className="size-[78px] rounded-[7px]"
    />
  </Question.Image>
</Question>

// 기본 fallback 이미지
<Question.Image>
  <img src="/checker.svg" alt="기본 이미지" className="size-[78px] rounded-[7px]" />
</Question.Image>

// 커스텀 fallback 컴포넌트
<Question.Image fallback={
  <div className="flex size-[78px] items-center justify-center rounded-[7px] bg-background-tertiary">
    <PlaceholderIcon />
  </div>
} />

// service/app에서 Next.js Image 사용 시
<Question state="default">
  <Question.Image>
    <Image 
      src="/question-images/sample.jpg"
      alt="질문 관련 이미지"
      width={78}
      height={78}
      className="rounded-[7px]"
      priority
    />
  </Question.Image>
</Question>
```

**이유:**
- **패키지 독립성**: shared/design은 Next.js에 의존하지 않는 순수 React 컴포넌트
- **유연성**: 일반 img 태그와 Next.js Image 모두 주입 가능
- **프레임워크 중립**: 다른 React 기반 프레임워크에서도 재사용 가능
- **커스터마이징**: fallback 컴포넌트와 다양한 이미지 처리 방식 지원

#### 4. **사용 예시 변경**

**변경 전 (Figma):**
```typescript
<QuestionComponent variant="state=selected,image=true" />
```

**변경 후 (현재):**
```typescript
<Question state="selected" onClick={handleClick}>
  <Question.Title>사용자 정의 제목</Question.Title>  {/* 자동으로 접근성 라벨로 사용됨 */}
  <Question.Image fallback={<CustomFallback />} />
  <Question.DeleteButton canDelete={canDelete} onDelete={onDelete} />
</Question>
```


