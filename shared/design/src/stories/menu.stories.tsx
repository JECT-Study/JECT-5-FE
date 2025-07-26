import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "../components/menu"
import { Edit, MoreDot, Trash, Unshare } from "../icons"

/**
 * # Menu Component
 *
 * 드롭다운 메뉴 컴포넌트입니다. 수직/수평 레이아웃과 텍스트/아이콘 타입을 지원합니다.
 *
 * ## 사용법
 *
 * ```tsx
 * import {
 *   DropdownMenuRoot,
 *   DropdownMenuTrigger,
 *   DropdownMenuContent,
 *   DropdownMenuItem
 * } from "../components/menu"
 *
 * function MyMenu() {
 *   return (
 *     <DropdownMenuRoot>
 *       <DropdownMenuTrigger>메뉴</DropdownMenuTrigger>
 *       <DropdownMenuContent type="vertical" contentType="text">
 *         <DropdownMenuItem type="text">메뉴 아이템 1</DropdownMenuItem>
 *         <DropdownMenuItem type="text">메뉴 아이템 2</DropdownMenuItem>
 *       </DropdownMenuContent>
 *     </DropdownMenuRoot>
 *   )
 * }
 * ```
 *
 * ## 메뉴 타입
 * - `vertical`: 세로 레이아웃 (기본값)
 * - `horizontal`: 가로 레이아웃
 *
 * ## 콘텐츠 타입
 * - `text`: 텍스트만 표시 (기본값)
 * - `icon`: 아이콘과 텍스트 함께 표시
 */

const meta = {
  title: "Components/Menu",
  component: DropdownMenuContent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["vertical", "horizontal"],
      description: "메뉴의 레이아웃 방향을 선택합니다",
    },
    contentType: {
      control: { type: "select" },
      options: ["text", "icon"],
      description: "메뉴 아이템의 콘텐츠 타입을 선택합니다",
    },
    sideOffset: {
      control: { type: "number", min: 0, max: 20 },
      description: "트리거와 메뉴 간의 거리",
    },
  },
} satisfies Meta<typeof DropdownMenuContent>

export default meta
type Story = StoryObj<typeof meta>

export const VerticalText: Story = {
  args: {
    type: "vertical",
    contentType: "text",
    sideOffset: 4,
  },
  render: (args) => (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <MoreDot />
      </DropdownMenuTrigger>
      <DropdownMenuContent {...args}>
        <DropdownMenuItem type="text">로그아웃</DropdownMenuItem>
        <DropdownMenuItem type="text">설정</DropdownMenuItem>
        <DropdownMenuItem type="text">도움말</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  ),
}

export const HorizontalIcon: Story = {
  args: {
    type: "horizontal",
    contentType: "icon",
    sideOffset: 4,
  },
  render: (args) => (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <MoreDot />
      </DropdownMenuTrigger>
      <DropdownMenuContent {...args}>
        <DropdownMenuItem type="icon">
          <Edit />
          수정
        </DropdownMenuItem>
        <DropdownMenuItem type="icon">
          <Unshare />
          공유
        </DropdownMenuItem>
        <DropdownMenuItem type="icon">
          <Trash />
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  ),
}
