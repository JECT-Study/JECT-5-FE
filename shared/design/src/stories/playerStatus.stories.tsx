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
## PlayerStatus 컴포넌트 - 게임 플레이어 상태 카드

게임 내 플레이어/팀의 상태를 표시하고 점수를 관리하는 핵심 컴포넌트입니다.

### 주요 특징

- **좌우 분할 인터랙션**: 왼쪽 절반 클릭 시 점수 감소, 오른쪽 절반 클릭 시 점수 증가
- **hover/active 시각적 피드백**:
  - 감소 영역: hover \`#FFC7C8\`, active \`#FF6467\`
  - 증가 영역: hover \`#BDDCFF\`, active \`#51A2FF\`
- **접근성 최적화**: 스크린리더 및 키보드 네비게이션 지원
- **긴 텍스트 처리**: 팀명 overflow 시 자동 truncate

### 레이아웃

#### scoreView=true (게임 진행 중)
\`\`\`
┌─────────────────────────────────────┐
│  [−] [팀이름]  │  [점수]  [+]       │
│   ← 클릭: 감소  │  클릭: 증가 →     │
└─────────────────────────────────────┘
\`\`\`

#### scoreView=false (팀 설정 화면)
\`\`\`
┌─────────────────────────────────────┐
│            [팀이름]                 │
└─────────────────────────────────────┘
\`\`\`

### 사용 예시

\`\`\`tsx
// 게임 진행 중 - 점수 조작 가능
<PlayerStatus
  name="A팀"
  score="0점"
  scoreView={true}
  onScoreIncrease={() => updateScore(+1)}
  onScoreDecrease={() => updateScore(-1)}
/>

// 팀 설정 화면 - 이름만 표시
<PlayerStatus
  name="A팀"
  score=""
  scoreView={false}
/>
\`\`\`

### 접근성 (A11y)

- \`role="group"\`: 카드 전체 그룹 식별
- \`aria-label\`: 각 버튼에 명확한 설명 제공
- 키보드: Tab으로 버튼 간 이동, Space/Enter로 활성화
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
- \`true\`: 좌우 분할 클릭 영역으로 점수 조작 (게임 진행 중)
- \`false\`: 팀명만 중앙 정렬로 표시 (팀 설정 화면)`,
      control: "boolean",
    },
    onScoreIncrease: {
      description: "오른쪽 영역 클릭 시 호출 (점수 증가)",
    },
    onScoreDecrease: {
      description: "왼쪽 영역 클릭 시 호출 (점수 감소)",
    },
    className: {
      description: "추가 CSS 클래스",
      control: "text",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[350px]">
        <Story />
      </div>
    ),
  ],
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
  parameters: {
    docs: {
      description: {
        story:
          "기본 상태입니다. 왼쪽 절반을 클릭하면 점수 감소, 오른쪽 절반을 클릭하면 점수 증가합니다. hover/active 시 배경색이 변경됩니다.",
      },
    },
  },
}

export const NameOnly: Story = {
  args: {
    name: "B팀",
    score: "",
    scoreView: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "팀 설정 화면에서 사용. 팀명만 중앙에 표시되고, 점수 조작 UI는 숨겨집니다.",
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
    name: "아주아주아주아주긴팀이름입니다",
    score: "7점",
    scoreView: true,
    onScoreIncrease: () => console.log("점수 증가"),
    onScoreDecrease: () => console.log("점수 감소"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "팀명이 길 경우 자동으로 truncate 처리되어 레이아웃이 깨지지 않습니다.",
      },
    },
  },
}

export const LongTeamNameOnly: Story = {
  name: "Long Team Name (No Score)",
  args: {
    name: "정말정말정말정말정말긴팀이름",
    score: "",
    scoreView: false,
  },
  parameters: {
    docs: {
      description: {
        story: "점수가 숨겨진 상태에서도 긴 팀명이 적절히 truncate 처리됩니다.",
      },
    },
  },
}

export const InteractionStates: Story = {
  args: {
    name: "B팀",
    score: "0점",
    scoreView: true,
    onScoreIncrease: () => console.log("점수 증가"),
    onScoreDecrease: () => console.log("점수 감소"),
  },
  parameters: {
    docs: {
      description: {
        story: `hover/active 상태를 테스트해보세요.

**왼쪽 영역 (점수 감소)**
- hover: 옅은 빨강 (#FFC7C8)
- active: 진한 빨강 (#FF6467)

**오른쪽 영역 (점수 증가)**
- hover: 옅은 파랑 (#BDDCFF)
- active: 진한 파랑 (#51A2FF)`,
      },
    },
  },
}

export const AllStatesComparison: Story = {
  args: {
    name: "비교용",
    score: "0점",
    scoreView: true,
  },
  decorators: [
    () => (
      <div className="flex w-[400px] flex-col gap-16">
        <div className="text-sm font-medium text-gray-600">
          점수 표시 상태 (scoreView=true)
        </div>
        <div className="flex flex-col gap-8">
          <PlayerStatus
            name="A팀"
            score="0점"
            scoreView={true}
            onScoreIncrease={() => console.log("점수 증가")}
            onScoreDecrease={() => console.log("점수 감소")}
          />
          <PlayerStatus
            name="우승팀"
            score="15점"
            scoreView={true}
            onScoreIncrease={() => console.log("점수 증가")}
            onScoreDecrease={() => console.log("점수 감소")}
          />
          <PlayerStatus
            name="매우긴팀이름테스트"
            score="20점"
            scoreView={true}
            onScoreIncrease={() => console.log("점수 증가")}
            onScoreDecrease={() => console.log("점수 감소")}
          />
        </div>

        <div className="mt-16 text-sm font-medium text-gray-600">
          팀명만 표시 (scoreView=false)
        </div>
        <div className="flex flex-col gap-8">
          <PlayerStatus name="A팀" score="" scoreView={false} />
          <PlayerStatus name="매우긴팀이름테스트" score="" scoreView={false} />
          <PlayerStatus name="Champions" score="" scoreView={false} />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "다양한 상태의 PlayerStatus를 한 번에 비교해볼 수 있습니다. hover/active 효과도 테스트해보세요.",
      },
    },
  },
}
