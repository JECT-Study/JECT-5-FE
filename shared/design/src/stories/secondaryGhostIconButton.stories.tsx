import { SecondaryGhostIconButton } from "../components/button/secondaryGhostIconButton"
import {
  Add,
  Arrow,
  Cross,
  Edit,
  Hidden,
  Magnifier,
  Minus,
  MoreDot,
  Play,
  Show,
  Sun,
  Trash,
  Unshare,
  Upload,
} from "../icons"

// 아이콘 맵핑을 위한 객체
const iconMap = {
  Add: <Add />,
  Arrow: <Arrow />,
  Cross: <Cross />,
  Edit: <Edit />,
  Hidden: <Hidden />,
  Magnifier: <Magnifier />,
  Minus: <Minus />,
  MoreDot: <MoreDot />,
  Play: <Play />,
  Show: <Show />,
  Sun: <Sun />,
  Trash: <Trash />,
  Unshare: <Unshare />,
  Upload: <Upload />,
}

export default {
  title: "Button/Icon/SecondaryGhostIconButton",
  component: SecondaryGhostIconButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## SecondaryGhostIconButton

보조 액션용 고스트 스타일 아이콘 버튼입니다.

### 주요 특징
- **고정 크기**: 44px × 44px (size-11)
- **고스트 스타일**: 기본 상태에서는 배경이 없고, hover/pressed 시에만 배경 표시
- **24px 아이콘**: 내부 아이콘 크기는 24px로 고정
- **보조 액션용**: 주요 액션이 아닌 보조적인 기능에 사용
- **접근성**: 키보드 네비게이션과 스크린리더 지원

### 사용 시나리오
- 툴바의 보조 액션 버튼
- 카드나 리스트 아이템의 액션 버튼
- 설정이나 옵션 버튼
- 편집/삭제 등의 보조 기능

### 디자인 토큰
- **기본 상태**: 배경 없음, 아이콘 색상 \`icon-interactive-secondary\`
- **Hover**: 배경 \`background-interactive-secondary-hovered\`
- **Pressed**: 배경 \`background-interactive-secondary-pressed\`
- **Disabled**: 배경 \`background-interactive-secondary-pressed\`, 아이콘 비활성화
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: "select",
      options: Object.keys(iconMap),
      description: "표시할 아이콘을 선택합니다",
      defaultValue: "Play",
    },
    disabled: {
      control: "boolean",
      description: "버튼을 비활성화하고 disabled 스타일을 적용합니다",
    },
    className: {
      control: "text",
      description: "추가 CSS 클래스명",
    },
    onClick: {
      action: "clicked",
      description: "클릭 이벤트 핸들러",
    },
  },
}

export const Playground = {
  args: {
    icon: "Play" as keyof typeof iconMap,
    disabled: false,
    className: "",
  },
  render: (args: {
    icon: keyof typeof iconMap
    disabled: boolean
    className: string
  }) => {
    const { icon, ...buttonProps } = args
    return (
      <SecondaryGhostIconButton {...buttonProps}>
        {iconMap[icon]}
      </SecondaryGhostIconButton>
    )
  },
}

export const InteractiveStates = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="text-center">
        <SecondaryGhostIconButton>
          <Play />
        </SecondaryGhostIconButton>
        <p className="mt-2 text-sm font-medium">Default</p>
        <p className="text-xs text-gray-500">기본 상태 (배경 없음)</p>
      </div>
      <div className="text-center">
        <SecondaryGhostIconButton disabled>
          <Play />
        </SecondaryGhostIconButton>
        <p className="mt-2 text-sm font-medium">Disabled</p>
        <p className="text-xs text-gray-500">비활성화 상태</p>
      </div>
      <div className="text-center">
        <div className="rounded bg-gray-100 p-2">
          <SecondaryGhostIconButton>
            <Play />
          </SecondaryGhostIconButton>
        </div>
        <p className="mt-2 text-sm font-medium">Hover/Pressed</p>
        <p className="text-xs text-gray-500">마우스 오버 시 배경 표시</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "버튼의 다양한 상태를 확인할 수 있습니다. 세 번째 버튼에 마우스를 올려보세요.",
      },
    },
  },
}

export const CommonUseCases = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-lg font-semibold">툴바 액션들</h3>
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
          <SecondaryGhostIconButton>
            <Edit />
          </SecondaryGhostIconButton>
          <SecondaryGhostIconButton>
            <Trash />
          </SecondaryGhostIconButton>
          <SecondaryGhostIconButton>
            <MoreDot />
          </SecondaryGhostIconButton>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">검색 및 필터</h3>
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
          <SecondaryGhostIconButton>
            <Magnifier />
          </SecondaryGhostIconButton>
          <SecondaryGhostIconButton>
            <Add />
          </SecondaryGhostIconButton>
          <SecondaryGhostIconButton>
            <Arrow />
          </SecondaryGhostIconButton>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">설정 및 옵션</h3>
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
          <SecondaryGhostIconButton>
            <Sun />
          </SecondaryGhostIconButton>
          <SecondaryGhostIconButton>
            <Show />
          </SecondaryGhostIconButton>
          <SecondaryGhostIconButton>
            <Hidden />
          </SecondaryGhostIconButton>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "실제 사용 시나리오에서 SecondaryGhostIconButton이 어떻게 활용되는지 보여줍니다.",
      },
    },
  },
}

export const WithDifferentIcons = {
  render: () => (
    <div className="grid grid-cols-7 gap-4">
      {Object.entries(iconMap).map(([name, icon]) => (
        <div key={name} className="text-center">
          <SecondaryGhostIconButton>{icon}</SecondaryGhostIconButton>
          <p className="mt-2 text-xs text-gray-600">{name}</p>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "사용 가능한 모든 아이콘들과 함께 버튼을 표시합니다.",
      },
    },
  },
}
