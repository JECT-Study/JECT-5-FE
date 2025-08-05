import type { Meta, StoryObj } from "@storybook/react-vite"

import { GameCreate } from "../components/gameCreate"

const meta = {
  title: "Components/GameCreate",
  component: GameCreate,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
# GameCreate Component

게임 만들기 카드 컴포넌트입니다. 사용자가 새로운 게임을 생성할 때 사용되는 직관적인 인터페이스를 제공합니다.

## 🏗️ 컴포넌트 구조

이 컴포넌트는 게임 생성의 시작점 역할을 하는 카드 형태의 컴포넌트입니다:

- **아이콘 영역**: 게임 생성과 관련된 시각적 아이콘 (178px × 168px)
- **텍스트 영역**: "게임 만들기" 라벨 (typography-heading-sm-bold)

## 🎨 디자인 특징

### 📐 크기 및 레이아웃
- **전체 크기**: 178px × 192px (아이콘 168px + 텍스트 24px)
- **레이아웃**: 세로 방향 정렬 (flex-col)
- **간격**: 아이콘과 텍스트 사이 16px 간격 (gap-4)

### 🎯 상호작용
- **클릭 가능**: cursor-pointer로 클릭 가능함을 표시
- **호버 효과**: 필요시 커스텀 클래스로 호버 효과 추가 가능
- **접근성**: alt 텍스트로 스크린 리더 지원

## 💻 사용법

### 기본 사용법
\`\`\`tsx
import { GameCreate } from "@shared/design/src/components/gameCreate"

function GameLibrary() {
  const handleCreateGame = () => {
    // 게임 생성 페이지로 이동
    router.push("/create")
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      <GameCreate onClick={handleCreateGame} />
      {/* 다른 게임 카드들 */}
    </div>
  )
}
\`\`\`

### 커스텀 스타일링
\`\`\`tsx
<GameCreate 
  onClick={handleCreateGame}
  className="hover:scale-105 transition-transform"
/>
\`\`\`

## 🎯 주요 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`onClick\` | \`() => void\` | \`undefined\` | 클릭 시 실행할 함수 |
| \`className\` | \`string\` | \`""\` | 추가 CSS 클래스 |

## 🎨 디자인 토큰

- **아이콘**: \`/create-game-icon.svg\` (178px × 168px)
- **텍스트**: \`typography-heading-sm-bold\` (19px, Bold, 120% line-height)
- **색상**: \`text-text-primary\` (기본 텍스트 색상)
- **텍스트 처리**: \`truncate\` (오버플로우 시 말줄임표)

## 🔗 관련 컴포넌트

- **GameCard**: 기존 게임을 표시하는 카드 컴포넌트
- **Button**: 다양한 버튼 컴포넌트들
- **Dialog**: 모달 대화상자 컴포넌트

## ⚠️ 주의사항

- 아이콘 파일(\`/create-game-icon.svg\`)이 public 디렉토리에 있어야 합니다
- 클릭 핸들러는 필수가 아니지만, 실제 사용 시에는 반드시 제공해야 합니다
- 텍스트는 자동으로 말줄임표 처리되므로 긴 텍스트는 지원하지 않습니다
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof GameCreate>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}