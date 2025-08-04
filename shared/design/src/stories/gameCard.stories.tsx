import type { Meta, StoryObj } from "@storybook/react-vite"

import { GameCard } from "../components/gameCard"

type StorybookGameCardProps = {
  type: "libraryGame" | "myGame" | "gamePreview" | "onlyTitleGamePreview"
  title: string
  questionCount: number
  imageUrl?: string
  optionView?: boolean
  onEdit?: () => void
  onShare?: () => void
  onDelete?: () => void
  onMoreClick?: () => void
}

const meta: Meta<StorybookGameCardProps> = {
  title: "Components/GameCard",
  component: GameCard as React.ComponentType<StorybookGameCardProps>,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
# GameCard Component

게임 카드 컴포넌트입니다. 다양한 타입의 게임 카드를 표시하며, 옵션 메뉴와 드롭다운을 지원합니다.

## 🏗️ 컴포넌트 구조

이 컴포넌트는 다양한 게임 카드 타입을 지원하는 통합 컴포넌트입니다:

- **썸네일 영역**: 게임 이미지 또는 체커 패턴 표시
- **제목 영역**: 게임 제목과 문제 수 배지
- **옵션 메뉴**: myGame 타입에서 MoreDot 버튼과 드롭다운 메뉴

## 🎮 카드 타입별 특징

### 📚 libraryGame (라이브러리 게임)
- **크기**: 178px × 238px (표준 카드)
- **특징**: 옵션 메뉴 없음, 읽기 전용 카드
- **사용처**: 게임 라이브러리, 공유된 게임 목록

### 🎯 myGame (내가 만든 게임)
- **크기**: 178px × 238px (표준 카드)
- **특징**: MoreDot 버튼과 드롭다운 메뉴 포함
- **메뉴 옵션**: 게임 수정, 게임 공유, 게임 삭제
- **사용처**: 내가 만든 게임 목록

### 👀 gamePreview (게임 프리뷰)
- **크기**: 178px × 260px (큰 썸네일)
- **특징**: 더 큰 썸네일로 게임 미리보기
- **사용처**: 게임 상세 페이지, 프리뷰 모드

### 📝 onlyTitleGamePreview (제목만 있는 프리뷰)
- **크기**: 178px × 238px (제목만 표시)
- **특징**: 썸네일 없이 제목과 문제 수만 표시
- **사용처**: 간단한 게임 목록, 컴팩트한 레이아웃

## 🎨 주요 기능

### 🖼️ 체커 패턴
이미지가 없을 때 체커 패턴을 표시하여 시각적 일관성을 유지합니다:

\`\`\`tsx
<GameCard
  type="libraryGame"
  title="이미지 없는 게임"
  questionCount={10}
  // imageUrl이 없으면 체커 패턴 자동 표시
/>
\`\`\`

### 🏷️ 문제 수 배지
썸네일 우상단에 문제 수를 표시하는 배지:

\`\`\`tsx
<GameCard
  type="libraryGame"
  title="수학 퀴즈"
  questionCount={15} // 배지에 "15" 표시
  imageUrl="game-image.jpg"
/>
\`\`\`

### 📋 드롭다운 메뉴 (myGame 타입)
MoreDot 버튼을 클릭하면 게임 관리 옵션이 나타납니다:

\`\`\`tsx
<GameCard
  type="myGame"
  title="내가 만든 게임"
  questionCount={20}
  onEdit={() => console.log("게임 수정")}
  onShare={() => console.log("게임 공유")}
  onDelete={() => console.log("게임 삭제")}
/>
\`\`\`

### 📝 반응형 텍스트
긴 제목은 두 줄로 제한하고 말줄임표 처리:

\`\`\`tsx
<GameCard
  type="libraryGame"
  title="매우 긴 제목의 게임입니다. 이 제목은 두 줄로 표시되어야 합니다."
  questionCount={10}
/>
\`\`\`

## 🎯 Figma 연동

모든 카드 타입은 Figma 디자인 시스템과 완벽히 동기화되어 있습니다:

- **정확한 크기**: 썸네일 178px, 제목 영역 46px
- **일관된 간격**: 썸네일과 제목 사이 14px
- **올바른 색상**: 디자인 토큰 기반 색상 시스템
- **타이포그래피**: 19px, font-bold, line-height 120%

## 📋 기본 사용법

\`\`\`tsx
import { GameCard } from "../components/gameCard"

function GameLibrary() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <GameCard
        type="libraryGame"
        title="수학 퀴즈 게임"
        questionCount={10}
        imageUrl="https://example.com/math-quiz.jpg"
      />
      
      <GameCard
        type="myGame"
        title="내가 만든 게임"
        questionCount={15}
        imageUrl="https://example.com/my-game.jpg"
        onEdit={() => handleEdit()}
        onShare={() => handleShare()}
        onDelete={() => handleDelete()}
      />
    </div>
  )
}
\`\`\`

## ⚠️ 주의사항

### 🎮 타입별 Props 제한
각 카드 타입에 따라 사용 가능한 props가 다릅니다:

- **libraryGame**: 기본 props만 사용 가능
- **myGame**: onEdit, onShare, onDelete 콜백 함수 필요
- **gamePreview**: 더 큰 썸네일 표시
- **onlyTitleGamePreview**: imageUrl 무시됨

### 🖼️ 이미지 처리
- **imageUrl 제공**: 해당 이미지 표시
- **imageUrl 미제공**: 체커 패턴 표시
- **이미지 로드 실패**: 체커 패턴으로 자동 대체

### 🎯 접근성
- MoreDot 버튼에 \`aria-label="게임 옵션 메뉴"\` 설정
- 문제 수 배지의 색상 대비 WCAG AA 기준 준수
- 키보드 네비게이션 완전 지원

## 🎨 디자인 토큰

CVA(Class Variance Authority)를 사용한 일관된 스타일링으로 디자인 시스템과 완벽히 통합됩니다.

- **썸네일 크기**: 178px × 178px (gamePreview: 178px × 260px)
- **제목 영역**: 46px 높이
- **카드 전체**: 238px 높이 (gamePreview: 260px)
- **간격**: 썸네일-제목 14px
- **타이포그래피**: 19px, font-bold, line-clamp-2
        `
      }
    }
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["libraryGame", "myGame", "gamePreview", "onlyTitleGamePreview"],
    },
    title: {
      control: { type: "text" },
    },
    questionCount: {
      control: { type: "number" },
    },
    imageUrl: {
      control: { type: "text" },
    },
    optionView: {
      control: { type: "boolean" },
      if: { arg: 'type', eq: 'myGame' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const LibraryGame: Story = {
  args: {
    type: "libraryGame",
    title: "수학 퀴즈 게임",
    questionCount: 10,
    imageUrl: "https://picsum.photos/id/237/536/354",
  },
}

export const MyGame: Story = {
  args: {
    type: "myGame",
    title: "내가 만든 게임",
    questionCount: 15,
    imageUrl: "https://picsum.photos/id/237/536/354",
    optionView: false,
  },
}

export const GamePreview: Story = {
  args: {
    type: "gamePreview",
    title: "게임 프리뷰",
    questionCount: 8,
    imageUrl: "https://picsum.photos/id/237/536/354",
  },
}

export const OnlyTitleGamePreview: Story = {
  args: {
    type: "onlyTitleGamePreview",
    title: "제목만 있는 게임",
    questionCount: 5,
  },
}

export const LongTitle: Story = {
  args: {
    type: "libraryGame",
    title: "매우 긴 제목의 게임입니다. 이 제목은 두 줄로 표시되어야 합니다.",
    questionCount: 20,
    imageUrl: "https://picsum.photos/id/237/536/354",
  },
}

export const NoImage: Story = {
  args: {
    type: "libraryGame",
    title: "이미지 없는 게임",
    questionCount: 12,
  },
}