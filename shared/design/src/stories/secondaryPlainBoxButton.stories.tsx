import { SecondaryPlainBoxButton } from "../components/button/secondaryPlainBoxButton"

export default {
  title: "Button/SecondaryPlainBoxButton",
  component: SecondaryPlainBoxButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Secondary plain 스타일의 간단한 박스 버튼 컴포넌트입니다. 고정 너비(120px)와 심플한 디자인이 특징입니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: { type: "text" },
      description: "버튼 내부에 표시될 텍스트 또는 요소",
      table: {
        type: { summary: "React.ReactNode" },
      },
    },
    disabled: {
      control: { type: "boolean" },
      description: "버튼 비활성화 여부",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    className: {
      control: { type: "text" },
      description: "추가 CSS 클래스명",
      table: {
        type: { summary: "string" },
      },
    },
    onClick: {
      action: "clicked",
      description: "버튼 클릭 이벤트 핸들러",
      table: {
        type: { summary: "() => void" },
      },
    },
    asChild: {
      control: { type: "boolean" },
      description: "Radix UI Slot 패턴 사용 여부",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
}

// 기본 컨트롤 스토리 - 모든 props를 테스트할 수 있음
export const Playground = {
  args: {
    children: "Plain Button",
    disabled: false,
    asChild: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "모든 props를 직접 조작하여 버튼의 다양한 상태를 테스트해볼 수 있습니다. Controls 패널에서 disabled, className 등을 변경해보세요.",
      },
    },
  },
}

// 상호작용 상태 테스트 스토리
export const InteractiveStates = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-lg font-semibold">Normal State</h3>
        <SecondaryPlainBoxButton>Hover해보세요</SecondaryPlainBoxButton>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-lg font-semibold">Disabled State</h3>
        <SecondaryPlainBoxButton disabled>Disabled</SecondaryPlainBoxButton>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "버튼의 상호작용 상태를 테스트할 수 있습니다. 일반 상태에서는 hover 효과를, 비활성화 상태에서는 disabled 스타일을 확인할 수 있습니다.",
      },
    },
  },
}

// 커스텀 스타일링 예제
export const CustomStyling = {
  render: () => (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-lg font-semibold">Default Styling</h3>
        <SecondaryPlainBoxButton>Default</SecondaryPlainBoxButton>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-lg font-semibold">Custom Width</h3>
        <SecondaryPlainBoxButton className="w-[200px]">
          Wide Button
        </SecondaryPlainBoxButton>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-lg font-semibold">Custom Background</h3>
        <SecondaryPlainBoxButton className="bg-blue-100 text-blue-800">
          Custom Style
        </SecondaryPlainBoxButton>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "className prop을 통해 커스텀 스타일을 적용할 수 있습니다. cn 유틸리티로 안전하게 클래스가 병합됩니다.",
      },
    },
  },
}

// AsChild 패턴 예제
export const AsChildPattern = {
  render: () => (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-lg font-semibold">Regular Button</h3>
        <SecondaryPlainBoxButton>Regular Button</SecondaryPlainBoxButton>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-lg font-semibold">As Link (asChild)</h3>
        <SecondaryPlainBoxButton asChild>
          <a href="#" onClick={(e) => e.preventDefault()}>
            Link Button
          </a>
        </SecondaryPlainBoxButton>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "asChild prop을 사용하면 버튼 스타일을 유지하면서 다른 요소(링크 등)로 렌더링할 수 있습니다. Radix UI Slot 패턴을 활용합니다.",
      },
    },
  },
}
