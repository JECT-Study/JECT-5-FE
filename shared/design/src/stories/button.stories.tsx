import { PrimaryBoxButton } from "../components/button/primaryBoxButton"
import { Trash } from "../icons"

export default {
  title: "Button/PrimaryBoxButton",
  component: PrimaryBoxButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "Primary 색상의 Solid 스타일 버튼입니다. 주요 액션에 사용하세요.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl"],
      description:
        "버튼의 크기를 설정합니다. \n2xl와 xl은 width가 fixed, 나머지는 width가 자동으로 조정됩니다.",
    },
    _style: {
      control: "select",
      options: ["solid", "outline"],
      description:
        "버튼의 스타일을 설정합니다. \nsolid는 배경색이 있는 버튼, outline는 테두리만 있는 버튼입니다.",
    },
    children: {
      control: "text",
      description: "버튼 내부에 표시될 텍스트입니다.",
    },
    className: {
      control: "text",
      description: "현재 적용된 버튼 스타일을 override할수 있습니다",
    },
    disabled: {
      control: "boolean",
      description: "버튼의 비활성화 상태를 설정합니다.",
    },
  },
}

export const SolidButton = {
  args: {
    size: "md",
    _style: "solid",
    children: "Solid Button",
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Primary 색상의 Solid 스타일 버튼입니다. 주요 액션에 사용하세요.",
      },
    },
  },
}

export const OutlineButton = {
  args: {
    size: "md",
    _style: "outline",
    children: "Outline Button",
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "테두리만 있는 Outline 스타일 버튼입니다. 보조 액션에 사용하세요.",
      },
    },
  },
}

export const WithIcon = {
  args: {
    size: "lg",
    _style: "solid",
    children: (
      <>
        <Trash className="fill-white" />
        게임 더 보기
      </>
    ),
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "모든 크기를 테스트해보세요. xs부터 2xl까지 다양한 크기를 Controls에서 변경할 수 있습니다.",
      },
    },
  },
}
