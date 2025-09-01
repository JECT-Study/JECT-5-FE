import type { Meta, StoryObj } from "@storybook/react-vite"

import { PlayerStatus } from "../components/playerStatus"

const meta = {
  title: "Components/PlayerStatus",
  component: PlayerStatus,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## 🎯 PlayerStatus 컴포넌트 - 게임 플레이어 상태 카드

게임 내 플레이어/팀의 상태를 표시하고 점수를 관리하는 핵심 컴포넌트입니다. **상태 기반 반응형 레이아웃**을 통해 다양한 게임 상황에 대응합니다.

### 🏗️ 주요 특징

- **상태 기반 레이아웃**: \`scoreView\` prop에 따른 자동 레이아웃 전환
- **접근성 최적화**: 스크린리더 및 키보드 네비게이션 완벽 지원  
- **긴 텍스트 안전성**: 팀명 overflow 시 자동 truncate 처리
- **인터랙티브 점수 조작**: 실시간 점수 증감 버튼

### 📱 언제 사용하나요?

- **게임 진행 중**: 플레이어별 점수 표시 및 실시간 조작
- **팀 관리 화면**: 점수 없이 팀명만 깔끔하게 표시
- **사이드바/목록**: 플레이어 상태 요약 정보 제공
- **점수판**: 게임 결과 및 순위 표시

### ⚠️ 주의사항 & Best Practices

#### 📏 **레이아웃 제약사항**
- 카드 고정 너비: **350px**
- 내부 콘텐츠 최대 너비: **310px**
- 점수 섹션 고정 너비: **138px** (버튼 + 점수 영역)

#### 🎨 **팀명 처리 규칙**
\`\`\`typescript
// ✅ 권장: 적절한 길이
<PlayerStatus name="A팀" />
<PlayerStatus name="우승팀" />

// ⚠️ 긴 이름: 자동 truncate 적용
<PlayerStatus name="아주아주긴팀이름입니다정말긴팀이름" />
// → "아주아주긴팀이름입니..."로 표시

// 🔥 특수문자 지원
<PlayerStatus name="🔥Team Alpha™" />
\`\`\`

#### 🎮 **점수 관리 패턴**
\`\`\`typescript
// 게임 진행 중 - 점수 조작 가능
<PlayerStatus 
  scoreView={true}
  onScoreIncrease={() => updateScore(+1)}
  onScoreDecrease={() => updateScore(-1)}
/>

// 팀 설정 화면 - 이름만 표시
<PlayerStatus scoreView={false} />

// 게임 결과 - 점수만 표시 (조작 불가)
<PlayerStatus 
  scoreView={true}
  // onScore* props 제거하면 버튼 비활성화
/>
\`\`\`

### 🔗 관련 컴포넌트

- \`SecondaryPlainIconButton\`: 점수 증감 버튼
- \`Add\`, \`Minus\`: 점수 조작 아이콘  
- \`GameSetup\`: PlayerStatus를 활용하는 상위 컴포넌트

### 🎯 접근성 (A11y) 상세

#### **ARIA 라벨링 시스템**
\`\`\`typescript
// 카드 전체 그룹 식별
role="group" 
aria-label="{팀명} 점수 카드"

// 점수 증감 버튼 명확한 설명
aria-label="{팀명} 점수 증가"
aria-label="{팀명} 점수 감소"

// 현재 점수 상태 알림
aria-label="{팀명} 현재 점수"
\`\`\`

#### **키보드 네비게이션**
- \`Tab\`: 점수 버튼 간 순차 이동
- \`Space/Enter\`: 버튼 활성화
- \`Shift+Tab\`: 역순 이동

#### **스크린리더 지원**
- 카드 진입 시: "{팀명} 점수 카드"
- 버튼 포커스: "{팀명} 점수 증가 버튼"
- 점수 변경 시: 자동 상태 업데이트 알림

### 🔄 Figma 디자인 대비 주요 개선사항

#### 1. **반응형 레이아웃 시스템**
**변경 전 (Figma)**: 고정된 \`padding: 39px 20px\`  
**변경 후 (현재)**: 상태별 동적 레이아웃 

\`\`\`css
/* scoreView=true: 좌우 공간 분할 */
.team-name { flex: 1; text-align: center; }
.score-section { width: 138px; }

/* scoreView=false: 전체 중앙 정렬 */
.team-name { width: 100%; text-align: center; }
\`\`\`

#### 2. **E2E 테스트 친화적 접근성**
**추가된 기능**: 테스트 자동화를 위한 접근성 강화
- 컴포넌트별 명확한 \`role\` 속성
- 버튼별 고유 \`aria-label\` 제공
- 상태 변경 감지 가능한 구조

#### 3. **확장 가능한 토큰 시스템**
**개선된 부분**: Design Token 기반 스타일링
- \`typography-heading-xl-medium\`: 팀명 스타일
- \`typography-heading-lg-semibold\`: 점수 스타일  
- \`background-primary\`: 카드 배경 토큰
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      description: "플레이어/팀 이름. 긴 이름은 자동으로 truncate 처리됩니다.",
      control: "text",
    },
    score: {
      description: "현재 점수 표시 텍스트 (예: '0점', '15점')",
      control: "text",
    },
    scoreView: {
      description: `점수 조작 UI 표시 여부
- \`true\`: 점수와 증감 버튼 표시 (게임 진행 중)
- \`false\`: 팀명만 중앙 정렬로 표시 (팀 관리 화면)`,
      control: "boolean",
    },
    onScoreIncrease: {
      description: "점수 증가 버튼 클릭 시 호출되는 함수",
    },
    onScoreDecrease: {
      description: "점수 감소 버튼 클릭 시 호출되는 함수",
    },
    className: {
      description: "추가 CSS 클래스 (선택사항)",
      control: "text",
    },
  },
} satisfies Meta<typeof PlayerStatus>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: "Default (With Score)",
  args: {
    name: "A팀",
    score: "0점",
    scoreView: true,
    onScoreIncrease: () => console.log("점수 증가"),
    onScoreDecrease: () => console.log("점수 감소"),
  },
}

export const NameOnly: Story = {
  args: {
    name: "B팀",
    score: "0점",
    scoreView: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "팀 관리 화면이나 점수가 필요 없는 상황에서 사용. 팀명이 카드 중앙에 배치됩니다.",
      },
    },
  },
}

export const HighScore: Story = {
  args: {
    name: "우승팀",
    score: "42점",
    scoreView: true,
    onScoreIncrease: () => console.log("점수 증가"),
    onScoreDecrease: () => console.log("점수 감소"),
  },
  parameters: {
    docs: {
      description: {
        story: "게임이 진행되면서 점수가 높아진 상태입니다.",
      },
    },
  },
}

export const LongTeamName: Story = {
  args: {
    name: "아주아주아주아주긴팀이름입니다정말긴팀이름",
    score: "7점",
    scoreView: true,
    onScoreIncrease: () => console.log("점수 증가"),
    onScoreDecrease: () => console.log("점수 감소"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "팀명이 매우 길 경우 자동으로 truncate 처리되어 레이아웃이 깨지지 않습니다.",
      },
    },
  },
}

export const LongTeamNameOnly: Story = {
  name: "Long Team Name (No Score)",
  args: {
    name: "정말정말정말정말정말긴팀이름테스트용도입니다",
    score: "0점",
    scoreView: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "점수가 숨겨진 상태에서도 긴 팀명이 적절히 처리되는지 확인할 수 있습니다.",
      },
    },
  },
}

export const SpecialCharacters: Story = {
  args: {
    name: "🔥이모지가 포함된 팀명",
    score: "3점",
    scoreView: true,
    onScoreIncrease: () => console.log("점수 증가"),
    onScoreDecrease: () => console.log("점수 감소"),
  },
  parameters: {
    docs: {
      description: {
        story: "이모지나 특수 문자가 포함된 팀명도 정상적으로 처리됩니다.",
      },
    },
  },
}

export const AllStates: Story = {
  name: "All States Comparison",
  args: {
    name: "비교용",
    score: "0점",
    scoreView: true,
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="text-sm font-medium text-gray-600">점수 표시 상태</div>
      <div className="flex flex-col gap-2">
        <PlayerStatus
          name="시작팀"
          score="0점"
          scoreView={true}
          onScoreIncrease={() => console.log("점수 증가")}
          onScoreDecrease={() => console.log("점수 감소")}
        />
        <PlayerStatus
          name="중간팀"
          score="15점"
          scoreView={true}
          onScoreIncrease={() => console.log("점수 증가")}
          onScoreDecrease={() => console.log("점수 감소")}
        />
        <PlayerStatus
          name="매우긴팀이름테스트매우긴팀이름테스트매우긴팀이름테스트"
          score="20점"
          scoreView={true}
          onScoreIncrease={() => console.log("점수 증가")}
          onScoreDecrease={() => console.log("점수 감소")}
        />
      </div>

      <div className="mt-4 text-sm font-medium text-gray-600">팀명만 표시</div>
      <div className="flex flex-col gap-2">
        <PlayerStatus name="A팀" score="0점" scoreView={false} />
        <PlayerStatus
          name="매우긴팀이름테스트매우긴팀이름테스트매우긴팀이름테스트"
          score="0점"
          scoreView={false}
        />
        <PlayerStatus name="🏆Champions" score="0점" scoreView={false} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "다양한 상태의 PlayerStatus를 한 번에 비교해볼 수 있습니다. QA 테스트 시 참고용으로 활용하세요.",
      },
    },
  },
}
