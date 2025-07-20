import type { StoryObj } from "@storybook/react-vite"
import { type ElementRef, useRef } from "react"
import { expect, fn, userEvent, within } from "storybook/test"

import { BaseButton } from "../components/button/baseButton"
import { PrimaryBoxButton } from "../components/button/primaryBoxButton"
import { Trash } from "../icons"

export default {
  title: "Button/PrimaryBoxButton",
  tags: ["autodocs"],
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
    onClick: {
      action: "clicked",
      description: "버튼 클릭 시 호출되는 함수입니다.",
    },
  },
  args: {
    onClick: fn(), // 기본 mock 함수
  },
}

export const SolidButton: StoryObj<typeof PrimaryBoxButton> = {
  args: {
    size: "md",
    _style: "solid",
    children: "Solid Button",
    disabled: false,
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Primary 색상의 Solid 스타일 버튼입니다. 주요 액션에 사용하세요.",
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole("button")

    // 버튼 클릭
    await userEvent.click(button)

    // onClick 함수가 호출되었는지 확인
    await expect(args.onClick).toHaveBeenCalled()
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
}

export const OutlineButton: StoryObj<typeof PrimaryBoxButton> = {
  args: {
    size: "md",
    _style: "outline",
    children: "Outline Button",
    disabled: false,
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "테두리만 있는 Outline 스타일 버튼입니다. 보조 액션에 사용하세요.",
      },
    },
  },
  render: (args) => {
    const ref = useRef<ElementRef<typeof BaseButton>>(null)
    return (
      <PrimaryBoxButton
        ref={ref}
        size="md"
        _style="outline"
        onClick={(e) => {
          console.log("Button clicked, ref current:", ref.current)
          args.onClick?.(e)
        }}
      >
        Outline Button with Ref
      </PrimaryBoxButton>
    )
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole("button")

    // 버튼 클릭
    await userEvent.click(button)

    // onClick 함수가 호출되었는지 확인
    await expect(args.onClick).toHaveBeenCalled()
  },
}

export const WithIcon: StoryObj<typeof PrimaryBoxButton> = {
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
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "모든 크기를 테스트해보세요. xs부터 2xl까지 다양한 크기를 Controls에서 변경할 수 있습니다.",
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole("button")

    // 아이콘이 포함된 버튼 클릭
    await userEvent.click(button)

    // onClick 함수가 호출되었는지 확인
    await expect(args.onClick).toHaveBeenCalled()

    // 아이콘이 렌더링되었는지 확인
    const icon = canvas.getByRole("button").querySelector("svg")
    await expect(icon).toBeInTheDocument()
  },
}

export const AsChildTest: StoryObj<typeof PrimaryBoxButton> = {
  args: {
    onClick: fn(),
  },
  render: () => {
    const ref = useRef<ElementRef<typeof BaseButton>>(null)

    return (
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <PrimaryBoxButton asChild size="md" _style="solid" ref={ref}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            Link as Button
          </a>
        </PrimaryBoxButton>

        <PrimaryBoxButton ref={ref} size="md" _style="solid">
          Normal Button
        </PrimaryBoxButton>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "asChild prop을 사용하여 다른 엘리먼트(예: a 태그)를 버튼 스타일로 렌더링할 수 있습니다. ref도 정상 작동합니다.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const linkButton = canvas.getByText("Link as Button")

    // asChild로 렌더링된 버튼이 a 태그인지 확인
    await expect(linkButton.tagName).toBe("A")
    await expect(linkButton).toHaveAttribute("href", "#")
  },
}

export const RefFocusTest: StoryObj<typeof PrimaryBoxButton> = {
  render: () => {
    const buttonRef = useRef<ElementRef<typeof BaseButton>>(null)

    const focusButton = () => {
      buttonRef.current?.focus()
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <button onClick={focusButton} style={{ padding: "0.5rem" }}>
          Focus Button Below
        </button>
        <PrimaryBoxButton ref={buttonRef} size="md" _style="outline">
          Target Button
        </PrimaryBoxButton>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "ref를 통해 버튼에 프로그래매틱하게 포커스를 설정할 수 있습니다. 위 버튼을 클릭하면 아래 버튼에 포커스가 이동합니다.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const focusButton = canvas.getByText("Focus Button Below")
    const targetButton = canvas.getByText("Target Button")

    // ref를 통한 포커스 설정 테스트
    await userEvent.click(focusButton)

    // 타겟 버튼이 포커스를 받았는지 확인
    await expect(targetButton).toHaveFocus()
  },
}

export const DisabledButtonTest: StoryObj<typeof PrimaryBoxButton> = {
  args: {
    size: "md",
    _style: "solid",
    children: "Disabled Button",
    disabled: true,
    onClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole("button")

    // 버튼이 비활성화되어 있는지 확인
    await expect(button).toBeDisabled()

    // 비활성화된 버튼 클릭 시도
    await userEvent.click(button)

    // onClick이 호출되지 않았는지 확인
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}
