# JECT-5-FE 성능 리팩토링 계획

**분석 대상**: `/Users/jh/JECT-5-FE/service/app`
**분석 기준**: Vercel React Best Practices Guide
**분석 일자**: 2026-01-17

---

## 📊 Executive Summary

총 **7개 이슈** 발견 → **7개 적용 권장**

### 예상 성능 개선

| 지표 | 현재 | 개선 후 | 개선율 |
|------|------|---------|--------|
| **Tree-shaking 효율** | 9개 파일 비최적 | 완전 최적화 | +100% |
| **Store 조회 복잡도** | O(n) | O(1) | -99% |
| **UX (Suspense)** | 로딩 중 빈 화면 | 스켈레톤 표시 | 향상 |
| **Bundle 중복** | radix-ui 패키지 혼용 | 통합 패키지 | 번들 감소 |
| **코드 품질** | verbose Dialog | 간결한 구조 | 유지보수성 향상 |

---

## ✅ 적용 필요 (7개)

### Priority: HIGH (즉시 적용) - 5개

| # | 이슈 | 파일 | Vercel Rule | 예상 개선 | 난이도 |
|---|------|------|-------------|-----------|--------|
| **1** | **Namespace imports 제거** | 9개 파일 | 2.1 tree-shaking | Bundle 최적화 | ⭐ 쉬움 |
| **2** | **findIndex → Map 구조** | Zustand stores | 7.2 lookup-optimization | O(n)→O(1) 조회 | ⭐⭐ 보통 |
| **5** | **Radix UI 패키지 통합** | design 컴포넌트들 | 2.1 tree-shaking | 번들 중복 제거 | ⭐ 쉬움 |
| **6** | **Dialog 코드 간소화** | `dialog/` | - | 코드량 감소 | ⭐⭐ 보통 |
| **7** | **useAuthGuard → AuthGuard** | 인증 필요 페이지들 | - | 선언적 패턴 | ⭐ 쉬움 |

### Priority: MEDIUM (선택적) - 1개

| # | 이슈 | 파일 | Vercel Rule | 예상 개선 | 난이도 |
|---|------|------|-------------|-----------|--------|
| **3** | **Suspense fallback 개선** | `games/page.tsx` | 1.5 async-suspense-boundaries | UX 개선 | ⭐ 쉬움 |

### Priority: 검증 필요 - 1개

| # | 이슈 | 파일 | Vercel Rule | 조건 |
|---|------|------|-------------|------|
| **4** | **React.cache() 추가** | `getGameDetail.ts` | 3.4 server-cache-react | 중복 요청 발생 시에만 |

---

## 🎯 상세 이슈

## HIGH #1: Namespace imports 제거 📦

**파일 (9개)**:
- `service/app/src/app/create/components/questionInputForm.tsx`
- `service/app/src/app/create/components/createGameNavigation.tsx`
- `service/app/src/app/game/[gameId]/components/teamInputForm.tsx`
- `service/app/src/app/games/components/GamesNavigation.tsx`
- `service/app/src/app/dashboard/components/dashboardGameSection.tsx`
- `service/app/src/app/_components/GameSection/GameSectionClient.tsx`
- `service/app/src/app/games/components/gamesLibrarySection.tsx`
- `service/app/src/entities/game/ui/gameLibraryGrid.tsx`
- `service/app/src/entities/game/ui/gamePreview.tsx`

### 문제점
```tsx
// ❌ 전체 namespace 번들에 포함
import * as TextField from "@ject-5-fe/design/components/textField"
import * as GameCard from "@/entities/game/ui/GameCard/gameCard"

<TextField.Root>
  <TextField.Label>질문*</TextField.Label>
  <TextField.Input ... />
</TextField.Root>
```

**왜 문제인가?**
- `import * as`는 tree-shaking 방해
- 사용하지 않는 컴포넌트도 번들에 포함
- 9개 파일에서 반복 사용으로 누적 영향

---

## HIGH #2: findIndex → Map 구조 🔄

**파일**:
- `service/app/src/app/create/store/useCreateGameStore.tsx` (6곳)
- `service/app/src/app/game/[gameId]/store/useGameStore.tsx` (2곳)

### 문제점
```tsx
// ❌ 매 호출마다 O(n) 검색
const addQuestion = () => {
  const selectedIndex = state.questions.findIndex((q) => q.id === selectedQuestionId)
  // ...
}

const moveQuestion = (id, direction) => {
  const index = state.questions.findIndex((q) => q.id === id)
  // ...
}

// 질문 10개 추가 시: 1+2+3+...+10 = 55회 배열 스캔
```

**왜 문제인가?**
- addQuestion, deleteQuestion, moveQuestion, updateQuestion 등에서 반복 호출
- 빈번한 사용자 인터랙션마다 O(n) 연산 누적

---

## MEDIUM #3: Suspense fallback 개선 💡

**파일**: `service/app/src/app/games/page.tsx`

### 문제점
```tsx
// ❌ null fallback → 로딩 중 빈 화면
export default function GamesPage() {
  return (
    <>
      <Suspense fallback={null}>
        <GamesNavigation />
      </Suspense>
      <Suspense fallback={null}>
        <GamesLibrarySection />
      </Suspense>
    </>
  )
}
```

**왜 문제인가?**
- 로딩 중 사용자에게 아무것도 보이지 않음
- CLS (Cumulative Layout Shift) 발생 가능
- UX 저하

---

## 검증 필요 #4: React.cache() 🔍

**파일**: `service/app/src/entities/game/api/getGameDetail.ts`

### 문제점
```tsx
// ❌ 동일 gameId로 여러 번 호출 시 중복 요청 가능성
export const getGameDetail = async (gameId: UUID) => {
  const response = await fetchClient.get<GameDetailData>(`games/${gameId}`)
  return response.json()
}

// generateMetadata와 컴포넌트에서 각각 호출 시 2번 요청 가능
```

**왜 문제인가?**
- generateMetadata + Page 컴포넌트에서 동일 데이터 중복 fetch 가능성
- 서버 사이드 요청 중복 제거 필요

---

## HIGH #5: Radix UI 패키지 중복 사용 📦

**파일**:
- `shared/design/src/components/checkBox/index.tsx`
- `shared/design/src/components/input/index.tsx`
- `shared/design/src/components/radioField/index.tsx`
- `shared/design/src/components/radio/RadioGroup.tsx`
- `shared/design/src/components/radio/RadioItem.tsx`

### 문제점
```tsx
// ❌ 개별 @radix-ui/* 패키지와 통합 radix-ui 패키지 혼용
import { useControllableState } from "@radix-ui/react-use-controllable-state"
import * as RadixRadioGroup from "@radix-ui/react-radio-group"

// 다른 파일에서는
import { Dialog } from "radix-ui"
```

**왜 문제인가?**
- 동일 기능의 코드가 번들에 중복 포함
- 패키지 버전 불일치 가능성
- 의존성 관리 복잡성 증가

---

## HIGH #6: Dialog 코드가 verbose함 🗂️

**파일**: `shared/design/src/components/dialog/`

### 문제점
```tsx
// ❌ 불필요한 variant 분기와 CustomDialog 중복
// - 77줄짜리 customDialog.tsx 별도 존재
// - variant prop으로 복잡한 조건부 렌더링
// - 동일 기능의 코드 중복

export function Dialog({ variant, ... }) {
  if (variant === "title") return <TitleDialog />
  if (variant === "onlyTitle") return <OnlyTitleDialog />
  if (variant === "onlyBody") return <OnlyBodyDialog />
  // ...
}
```

**왜 문제인가?**
- 불필요한 코드량 증가 (77줄 중복)
- variant별 분기로 유지보수 어려움
- Compound Component 패턴 미활용

---

## HIGH #7: useAuthGuard() hook 사용 방식 🔐

**파일**:
- `service/app/src/app/create/page.tsx`
- `service/app/src/app/dashboard/page.tsx`
- 기타 인증 필요 페이지들

### 문제점
```tsx
// ❌ Hook 기반 imperative 패턴
export default function CreateGamePage() {
  useAuthGuard()  // 컴포넌트 렌더링 후 리다이렉트

  return (
    <div className="bg-background-primary">
      <CreateGameNavigation />
      {/* 인증 안 된 상태에서도 잠깐 렌더링됨 (깜빡임) */}
    </div>
  )
}
```

**왜 문제인가?**
- 컴포넌트가 먼저 렌더링된 후 리다이렉트 → UI 깜빡임
- 인증 로직이 컴포넌트 내부에 숨어있어 가독성 저하
- 선언적이지 않은 패턴

---

## 📚 참고 자료

- [Vercel React Best Practices Guide](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
- [React.cache() 공식 문서](https://react.dev/reference/react/cache)
- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
