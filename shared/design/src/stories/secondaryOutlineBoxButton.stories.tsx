import { SecondaryOutlineBoxButton } from "../components/button/secondaryOutlineBoxButton"

export default {
  title: "Button/SecondaryOutlineBoxButton",
  component: SecondaryOutlineBoxButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Secondary outline 스타일의 박스 버튼 컴포넌트입니다. 가상선택자를 통해 hover, active, disabled 상태가 자동으로 처리됩니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["md", "lg"],
      description: "버튼의 크기를 설정합니다",
      table: {
        type: { summary: '"md" | "lg"' },
        defaultValue: { summary: '"md"' },
      },
    },
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
    onClick: {
      action: "clicked",
      description: "버튼 클릭 이벤트 핸들러",
      table: {
        type: { summary: "() => void" },
      },
    },
  },
}

// 기본 컨트롤 스토리 - 모든 props를 테스트할 수 있음
export const Playground = {
  args: {
    children: "NFC",
    size: "md",
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "모든 props를 직접 조작하여 버튼의 다양한 상태와 크기를 테스트해볼 수 있습니다. Controls 패널에서 size, disabled 등을 변경해보세요.",
      },
    },
  },
}

// 크기별 비교 스토리
export const AllSizes = {
  render: () => (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-lg font-semibold">Medium Size</h3>
        <SecondaryOutlineBoxButton size="md">
          Medium Button
        </SecondaryOutlineBoxButton>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-lg font-semibold">Large Size</h3>
        <SecondaryOutlineBoxButton size="lg">
          Large Button
        </SecondaryOutlineBoxButton>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "모든 크기 옵션을 한눈에 비교할 수 있습니다. md는 fit-content 크기이고, lg는 고정 크기(572px x 95px)입니다.",
      },
    },
  },
}

// 상태별 테스트 스토리
export const InteractiveStates = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-lg font-semibold">Normal State</h3>
        <SecondaryOutlineBoxButton size="md" asChild>
          <div>Hover나 클릭해보세요</div>
        </SecondaryOutlineBoxButton>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-lg font-semibold">Disabled State</h3>
        <SecondaryOutlineBoxButton size="md" disabled>
          Disabled Button
        </SecondaryOutlineBoxButton>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "버튼의 상호작용 상태를 테스트할 수 있습니다. 일반 버튼은 hover와 active 상태를, 비활성화 버튼은 disabled 상태를 확인할 수 있습니다.",
      },
    },
  },
}
