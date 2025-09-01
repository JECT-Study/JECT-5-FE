import type { Meta, StoryObj } from "@storybook/react-vite"

import { PlayerStatus } from "../components/playerStatus"

const meta = {
  title: "Components/PlayerStatus",
  component: PlayerStatus,
  parameters: {
    layout: "centered",
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
