import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"

import {
  Dialog,
  DialogBody,
  DialogButton,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../components/dialog"
import { CustomDialog } from "../components/dialog/customDialog"

/**
 * # Dialog Component
 *
 * 다양한 스타일의 모달 대화상자를 제공하는 컴포넌트입니다.
 *
 * ## 사용법
 *
 * ```tsx
 * import {
 *   Dialog,
 *   DialogTrigger,
 *   DialogContent,
 *   DialogHeader,
 *   DialogBody,
 *   DialogClose
 * } from "../components/dialog"
 *
 * function MyDialog() {
 *   return (
 *     <Dialog>
 *       <DialogTrigger>대화상자 열기</DialogTrigger>
 *       <DialogContent>
 *         <DialogHeader>제목</DialogHeader>
 *         <DialogBody>내용을 입력하세요</DialogBody>
 *         <DialogClose>닫기</DialogClose>
 *       </DialogContent>
 *     </Dialog>
 *   )
 * }
 * ```
 *
 * ## 구성 요소
 * - `Dialog`: 대화상자의 루트 컴포넌트
 * - `DialogTrigger`: 대화상자를 여는 트리거 버튼
 * - `DialogContent`: 대화상자의 메인 콘텐츠 영역
 * - `DialogHeader`: 대화상자의 제목 영역
 * - `DialogBody`: 대화상자의 본문 영역
 * - `DialogClose`: 대화상자를 닫는 버튼
 */

const meta = {
  title: "Components/Dialog",
  component: DialogContent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: false,
      description: "대화상자 내부 콘텐츠",
    },
  },
} satisfies Meta<typeof DialogContent>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
        기본 대화상자 열기
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>이 게임을 라이브러리에 등록하시겠습니까?</DialogHeader>
        <DialogBody>
          등록된 게임은 모든 사용자와 공유되며, 등록 후에는 수정이 불가능합니다.
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <DialogButton.Secondary>닫기</DialogButton.Secondary>
          </DialogClose>
          <DialogClose asChild>
            <DialogButton.Primary>네</DialogButton.Primary>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const WithTitleOnly: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
        제목만 있는 대화상자
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>이 게임을 라이브러리에 등록하시겠습니까?</DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <DialogButton.Secondary>취소</DialogButton.Secondary>
          </DialogClose>
          <DialogClose asChild>
            <DialogButton.Primary>확인</DialogButton.Primary>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const WithBodyOnly: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">
        본문만 있는 대화상자
      </DialogTrigger>
      <DialogContent>
        <DialogBody>
          등록된 게임은 모든 사용자와 공유되며, 등록 후에는 수정이 불가능합니다.
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <DialogButton.Secondary>취소</DialogButton.Secondary>
          </DialogClose>
          <DialogClose asChild>
            <DialogButton.Primary>삭제</DialogButton.Primary>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const ConfirmationDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
        확인 대화상자
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>이 게임을 라이브러리에 등록하시겠습니까?</DialogHeader>
        <DialogBody>
          등록된 게임은 모든 사용자와 공유되며, 등록 후에는 수정이 불가능합니다.
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <DialogButton.Secondary>취소</DialogButton.Secondary>
          </DialogClose>
          <DialogClose asChild>
            <DialogButton.Primary>삭제</DialogButton.Primary>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="rounded bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600">
          제어되는 대화상자
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>이 게임을 라이브러리에 등록하시겠습니까?</DialogHeader>
          <DialogBody>
            등록된 게임은 모든 사용자와 공유되며, 등록 후에는 수정이
            불가능합니다.
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <DialogButton.Secondary>아니요</DialogButton.Secondary>
            </DialogClose>
            <DialogClose asChild>
              <DialogButton.Primary>네</DialogButton.Primary>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
}

export const VariantTitle: Story = {
  render: () => (
    <CustomDialog
      variant="title"
      trigger={
        <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          타이틀+본문 다이얼로그 열기
        </button>
      }
      title="이 게임을 라이브러리에 등록하시겠습니까?"
      description="등록된 게임은 모든 사용자와 공유되며, 등록 후에는 수정이 불가능합니다."
      onConfirm={() => alert("확인")}
      onCancel={() => alert("취소")}
      confirmText="네"
      cancelText="아니요"
    />
  ),
}

export const VariantOnlyTitle: Story = {
  render: () => (
    <CustomDialog
      variant="onlyTitle"
      trigger={
        <button className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
          타이틀만 다이얼로그 열기
        </button>
      }
      title="이 게임을 라이브러리에 등록하시겠습니까?"
      onConfirm={() => alert("확인")}
      onCancel={() => alert("취소")}
      confirmText="네"
      cancelText="아니요"
    />
  ),
}

export const VariantOnlyBody: Story = {
  render: () => (
    <CustomDialog
      variant="onlyBody"
      trigger={
        <button className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">
          본문만 다이얼로그 열기
        </button>
      }
      description="등록된 게임은 모든 사용자와 공유되며, 등록 후에는 수정이 불가능합니다."
      onConfirm={() => alert("확인")}
      onCancel={() => alert("취소")}
      confirmText="네"
      cancelText="아니요"
    />
  ),
}
