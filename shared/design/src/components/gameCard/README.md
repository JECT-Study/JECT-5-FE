# GameCard 컴포넌트 접근성 및 테스트 가이드

> 🎮 **GameCard, MyGameCard, GameCardOptions 컴포넌트의 접근성 속성 및 테스트 ID 문서**

## 📋 개요

이 문서는 GameCard 관련 컴포넌트들의 접근성 속성과 테스트 ID를 정리한 가이드입니다. Playwright E2E 테스트 및 스크린 리더 지원을 위한 표준을 정의합니다.

## 🎯 컴포넌트별 접근성 속성

### 1. GameCard (기본 게임 카드)

**파일**: `shared/design/src/components/gameCard/index.tsx`

#### Props
```tsx
interface GameCardProps {
  children: ReactNode
  className?: string
  title?: string  // 접근성을 위한 게임 제목
}
```

#### 접근성 속성
```tsx
<div
  data-testid="game-card"
  role="article"
  aria-label={`게임 카드: ${title || "게임 카드"}`}
>
```

#### 하위 컴포넌트

##### GameCard.Image
```tsx
<div
  role="img"
  // aria-label은 내부 Image 컴포넌트의 alt 속성으로 처리
>
```

##### GameCard.Title
```tsx
<div
  role="heading"
  aria-level={3}
>
```

##### GameCard.Badge (문제 수 배지)
```tsx
<div
  role="status"
  aria-label={`문제 수: ${children}개`}
>
```

##### GameCard.SharedBadge (공유 배지)
```tsx
<div
  role="status"
  aria-label="공유된 게임"
>
```

### 2. MyGameCard (내 게임 카드)

**파일**: `shared/design/src/components/gameCard/myGameCard.tsx`

#### Props
```tsx
type MyGameCardProps = {
  children: React.ReactNode
  className?: string
  title?: string  // 접근성을 위한 게임 제목
}
```

#### 접근성 속성
```tsx
<GameCard
  data-testid="my-game-card"
  // aria-label은 GameCard에서 처리하여 중복 방지
>
```

### 3. GameCardOptions (게임 옵션 메뉴)

**파일**: `shared/design/src/components/gameCard/gameCardOptions.tsx`

#### Props
```tsx
export type GameCardOptionsProps = {
  shared?: boolean
  onEdit?: () => void
  onShare?: () => void
  onDelete?: () => void
}
```

#### 접근성 속성

##### 메뉴 트리거 버튼
```tsx
<SecondaryPlainIconButton
  aria-label="게임 옵션 메뉴 열기"
  data-testid="game-options-button"
  // aria-expanded와 aria-haspopup은 Radix UI가 자동으로 관리
>
```

##### 메뉴 아이템들
```tsx
// 수정 옵션
<DropdownMenuItem
  // aria-label은 내부 텍스트를 기반으로 Radix UI가 자동 생성
>

// 공유 옵션
<DropdownMenuItem
  // aria-label은 내부 텍스트를 기반으로 Radix UI가 자동 생성
>

// 삭제 옵션
<DropdownMenuItem
  // aria-label은 내부 텍스트를 기반으로 Radix UI가 자동 생성
>
```

## 🧪 테스트 ID 목록

### GameCard
- `game-card`: 기본 게임 카드 컨테이너

### MyGameCard
- `my-game-card`: 내 게임 카드 컨테이너

### GameCardOptions
- `game-options-button`: 옵션 메뉴 트리거 버튼

### Navigation (네비게이션)
- `navigation`: 기본 네비게이션 컨테이너
- `game-navigation`: 게임 설정 네비게이션 컨테이너
- `game-start-button`: 게임 시작 버튼 (게임 설정 페이지)
- `game-exit-button`: 게임 설정 나가기 버튼

### GamePreview (게임 미리보기 팝업)
- `game-preview-dialog`: 게임 미리보기 팝업 다이얼로그
- `game-start-button`: 게임 시작 버튼

## 🎯 Playwright 테스트 예시

### 기본 게임 카드 테스트
```tsx
// 게임 카드 존재 확인
await expect(page.getByTestId("game-card")).toBeVisible()

// 게임 제목 확인
await expect(page.getByRole("heading", { level: 3 })).toHaveText("게임 제목")

// 문제 수 배지 확인
await expect(page.getByRole("status")).toHaveText("10문제")

// 공유 배지 확인 (있는 경우)
await expect(page.getByRole("status", { name: "공유된 게임" })).toBeVisible()
```

### 내 게임 카드 테스트
```tsx
// 내 게임 카드 존재 확인
await expect(page.getByTestId("my-game-card")).toBeVisible()

// 옵션 메뉴 열기
await page.getByTestId("game-options-button").click()
await expect(page.getByTestId("game-options-button")).toHaveAttribute("aria-expanded", "true")

// 메뉴 아이템 클릭 (Radix UI가 자동으로 aria-label 생성)
await page.getByRole("menuitem", { name: "게임 수정" }).click()
```

### 게임 미리보기 팝업 테스트 (접근성 기반 셀렉터 사용)
```tsx
// 게임 미리보기 팝업 열기
await page.getByTestId("game-card").first().click()
await expect(page.getByTestId("game-preview-dialog")).toBeVisible()

// 게임 정보 확인 (접근성 기반 셀렉터 사용)
await expect(page.locator('#game-preview-title')).toHaveText("게임 제목")
await expect(page.locator('[aria-label^="제작자:"]')).toHaveText("제작자 이름")
await expect(page.locator('[aria-label*="문제"]')).toHaveText("총 10 문제")

// 게임 시작 버튼 클릭
await page.getByTestId("game-start-button").click()

// 팝업 닫기
await page.getByRole("button", { name: "팝업 닫기" }).click()
```

### 접근성 기반 셀렉터 사용
```tsx
// 역할 기반 셀렉터
await page.getByRole("article", { name: "게임 카드: 퀴즈 게임" }).click()

// 라벨 기반 셀렉터
await page.getByLabel("게임 옵션 메뉴 열기").click()

// 상태 기반 셀렉터
await page.getByRole("status", { name: "문제 수: 10개" }).toBeVisible()

// ID 기반 셀렉터 (aria-labelledby 연결)
await expect(page.locator('#game-preview-title')).toHaveText("게임 제목")

// aria-label 기반 셀렉터
await expect(page.locator('[aria-label^="제작자:"]')).toHaveText("제작자 이름")
await expect(page.locator('[aria-label*="문제"]')).toHaveText("총 10 문제")

// 이미지 alt 텍스트 기반 셀렉터
await expect(page.locator('img[alt*="문제 이미지"]')).toBeVisible()

// 네비게이션 접근성 테스트
await expect(page.getByTestId('navigation')).toHaveAttribute('role', 'navigation')
await expect(page.getByRole('button', { name: '내 게임' })).toBeVisible()
await expect(page.getByRole('button', { name: '게임 만들기' })).toBeEnabled()
```

## 📝 사용 가이드

### 1. GameCard 사용
```tsx
<GameCard title="퀴즈 게임">
  <GameCard.Image>
    <Image src="..." alt="퀴즈 게임 썸네일" />
  </GameCard.Image>
  <GameCard.Title>퀴즈 게임</GameCard.Title>
  <GameCard.Badge>10문제</GameCard.Badge>
  {isShared && <GameCard.SharedBadge>공유</GameCard.SharedBadge>}
</GameCard>
```

### 2. MyGameCard 사용
```tsx
<MyGameCard title="내 퀴즈 게임">
  <GameCard.Image>
    <Image src="..." alt="내 퀴즈 게임 썸네일" />
  </GameCard.Image>
  <GameCard.Title>내 퀴즈 게임</GameCard.Title>
  <GameCard.Badge>10문제</GameCard.Badge>
  <GameCardOptions 
    shared={true}
    onEdit={() => {}}
    onShare={() => {}}
    onDelete={() => {}}
  />
</MyGameCard>
```

### 3. GameCardOptions 사용
```tsx
<GameCardOptions
  shared={false}
  onEdit={() => console.log("수정")}
  onShare={() => console.log("공유")}
  onDelete={() => console.log("삭제")}
/>
```

## 🔧 접근성 개선 사항

### 1. 키보드 네비게이션
- 모든 인터랙티브 요소는 키보드로 접근 가능
- Tab 순서가 논리적으로 구성됨
- Enter/Space 키로 액션 실행 가능

### 2. 스크린 리더 지원
- 의미있는 `role` 속성 제공
- 명확한 `aria-label` 제공
- Radix UI의 자동 접근성 관리 활용

### 3. 시각적 피드백
- 포커스 상태 명확히 표시
- 호버 상태 시각적 피드백
- 활성 상태 구분

## ⚠️ 주의사항

1. **title prop 필수**: 접근성을 위해 GameCard와 MyGameCard 사용 시 `title` prop 제공 권장
2. **이미지 alt 텍스트**: GameCard.Image 내부의 Image 컴포넌트에 적절한 alt 텍스트 제공
3. **Radix UI 자동 관리**: GameCardOptions는 Radix UI의 자동 접근성 관리 활용 (aria-expanded, aria-haspopup, role="menuitem" 등)
4. **중복 방지**: MyGameCard는 GameCard의 aria-label을 재사용하여 중복 방지
5. **테스트 ID 최소화**: 필요한 경우에만 data-testid 사용하고, 가능하면 접근성 기반 셀렉터 우선 사용
6. **접근성 우선**: aria-labelledby, role, aria-label 등을 활용한 접근성 기반 테스트 권장
