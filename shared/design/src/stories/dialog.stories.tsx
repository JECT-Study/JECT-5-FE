import type { Meta, StoryObj } from "@storybook/react-vite"

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

/**
 * # Dialog Component
 *
 * 다양한 스타일의 다이얼로그를 제공하는 컴포넌트입니다.
 *
 * ## 접근성 향상 기능
 *
 * **srTitle**: DialogHeader가 없는 경우 스크린 리더 전용 제목을 제공할 수 있습니다.
 * - 시각적으로는 보이지 않지만 스크린 리더가 읽을 수 있어 접근성을 향상시킵니다
 * - DialogHeader가 존재하면 자동으로 무시됩니다
 * - WCAG 가이드라인에 따라 모든 다이얼로그는 적절한 제목을 가져야 합니다
 *
 * ```tsx
 * <DialogBody srTitle="삭제 확인">
 *   정말로 이 항목을 삭제하시겠습니까?
 * </DialogBody>
 * ```
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
 *   DialogFooter,
 *   DialogClose,
 *   DialogButton
 * } from "@ject-5-fe/design/components/dialog"
 *
 * function MyDialog() {
 *   return (
 *     <Dialog>
 *       <DialogTrigger>다이얼로그 열기</DialogTrigger>
 *       <DialogContent>
 *         <DialogHeader>제목</DialogHeader>
 *         <DialogBody>내용을 입력하세요</DialogBody>
 *         <DialogFooter>
 *           <DialogClose asChild>
 *             <DialogButton.Secondary>취소</DialogButton.Secondary>
 *           </DialogClose>
 *           <DialogClose asChild>
 *             <DialogButton.Primary>확인</DialogButton.Primary>
 *           </DialogClose>
 *         </DialogFooter>
 *       </DialogContent>
 *     </Dialog>
 *   )
 * }
 * ```
 *
 * ## 구성 요소
 * - `Dialog`: 다이얼로그의 루트 컴포넌트
 *   - `DialogTrigger`: 다이얼로그를 여는 트리거 버튼
 *   - `DialogContent`: 다이얼로그의 메인 콘텐츠 영역
 *     - `DialogHeader`: 다이얼로그의 제목 영역 (선택적)
 *     - `DialogBody`: 다이얼로그의 본문 영역 (선택적)
 *     - `DialogFooter`: 다이얼로그의 하단 버튼 영역
 *       - `DialogClose`: 다이얼로그를 닫는 버튼 로직 (스타일 없음)
 *         - `DialogButton`: 다이얼로그용 버튼 컴포넌트들 (스타일 있음)
 *           - `DialogButton.Primary`: PrimaryBoxButton 기반 (파란색)
 *           - `DialogButton.Secondary`: SecondaryPlainBoxButton 기반 (회색)
 *           - `DialogButton.Destructive`: DestructiveSolidBoxButton 기반 (빨간색)
 *
 * ## 사용 설명
 * 1. `DialogClose`는 `asChild`와 함께 사용하기
 *    - DialogClose는 닫기 기능만 제공하고 스타일은 없으므로, asChild prop을 사용해 DialogButton 컴포넌트에 닫기 기능을 전달하면서, 깔끔한 html구조를 유지할 수 있습니다
 *
 *    ```tsx
 *    <DialogClose asChild>
 *      <DialogButton.Primary>확인</DialogButton.Primary>
 *    </DialogClose>
 *    ```
 *
 * 2. `DialogButton`은 객체 패턴으로 사용하기
 *    - DialogButton은 footer의 버튼 overrides에 대응하기 위해 여러 버튼 스타일을 제공하는 객체형태로, dot notation으로 원하는 스타일을 선택해서 사용합니다.
 *
 *    ```tsx
 *    // PrimaryBoxButton 기반
 *    <DialogButton.Primary>확인</DialogButton.Primary>
 *
 *    // SecondaryPlainBoxButton 기반
 *    <DialogButton.Secondary>취소</DialogButton.Secondary>
 *
 *    // DestructiveSolidBoxButton 기반
 *    <DialogButton.Destructive>삭제</DialogButton.Destructive>
 *    ```
 *
 * 3. 접근성을 위한 `srTitle` 사용하기
 *    - WCAG 접근성 원칙에 의하면, DialogHeader와 DialogBody를 모두 사용해야 하지만, UI 상 그렇지 않은 경우가 존재합니다
 *    - DialogHeader를 사용하지 않는 다이얼로그에서는 DialogBody의 prop으로, 스크린 리더 사용자를 위한 srTitle을 추가할 수 있습니다
 *    - srTitle은 시각적으로는 보이지 않지만 스크린 리더가 읽을 수 있는 제목을 제공합니다
 *
 *    ```tsx
 *    <DialogBody srTitle="삭제 확인">
 *      정말로 삭제하시겠습니까?
 *    </DialogBody>
 *    ```
 *
 * ## 피그마 구현과 다른점
 * 피그마의 Dialog 컴포넌트에는 `style,type` variant가 있지만, 실제 구현에서는 사용하지 않습니다
 *
 * - **피그마**: Dialog variant로 style = `onlyTitle`, `onlyBody` 등을 선택
 * - **실제 구현**: 필요한 컴포넌트만 조합해서 사용
 *   - 제목만 필요한 경우: `DialogHeader`만 사용
 *   - 본문만 필요한 경우: `DialogBody`만 사용
 *   - 제목과 본문 모두 필요한 경우: `DialogHeader`와 `DialogBody` 모두 사용
 *
 * ---
 *
 * ## useDialog Hook
 *
 * 반복되는 다이얼로그 보일러플레이트를 줄이기 위한 추상화 훅입니다.
 *
 * ### Before (30~50줄)
 * ```tsx
 * overlay.open(({ isOpen, close }) => (
 *   <Dialog open={isOpen} onOpenChange={close}>
 *     <DialogContent>
 *       <DialogHeader>제목</DialogHeader>
 *       <DialogBody>내용</DialogBody>
 *       <DialogFooter>
 *         <DialogButton.Secondary onClick={() => close()}>취소</DialogButton.Secondary>
 *         <DialogButton.Primary onClick={() => { onConfirm(); close() }}>확인</DialogButton.Primary>
 *       </DialogFooter>
 *     </DialogContent>
 *   </Dialog>
 * ))
 * ```
 *
 * ### After (5줄)
 * ```tsx
 * const dialog = useDialog()
 * dialog.open({
 *   title: "제목",
 *   body: "내용",
 *   primary: { label: "확인", onClick: onConfirm },
 *   secondary: { label: "취소" },
 * })
 * ```
 *
 * ### API
 *
 * | 메서드 | 설명 |
 * |--------|------|
 * | `dialog.open(config)` | 콜백 방식. 버튼의 `onClick`으로 액션 처리 |
 * | `dialog.openAsync(config)` | Promise 반환. `primary` 또는 `destructive` 클릭 시 `true`, `secondary` 또는 배경 클릭 시 `false` |
 *
 * ### DialogConfig
 *
 * | 속성 | 타입 | 설명 |
 * |------|------|------|
 * | `title` | `string?` | 다이얼로그 제목 |
 * | `body` | `ReactNode?` | 다이얼로그 본문 |
 * | `role` | `"dialog" \| "alertdialog"?` | ARIA role |
 * | `primary` | `ButtonConfig?` | Primary 버튼 (파란색) |
 * | `secondary` | `ButtonConfig?` | Secondary 버튼 (회색) |
 * | `destructive` | `ButtonConfig?` | Destructive 버튼 (빨간색) |
 *
 * **Note:** `primary`와 `destructive`는 동시에 사용할 수 없습니다.
 *
 * ### 제한 사항
 *
 * 이 훅은 표준적인 다이얼로그 패턴(제목, 본문, 버튼)만 지원합니다.
 * 커스텀 레이아웃이나 복잡한 UI가 필요한 경우, 기존 Dialog 프리미티브를 직접 조합하세요.
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
      description: "다이얼로그 내부 콘텐츠",
    },
  },
} satisfies Meta<typeof DialogContent>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
        기본 다이얼로그 열기
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
        제목만 있는 다이얼로그
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
        본문만 있는 다이얼로그
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

export const SingleButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600">
        버튼 하나만 있는 다이얼로그
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>알림</DialogHeader>
        <DialogBody>작업이 성공적으로 완료되었습니다.</DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <DialogButton.Secondary>확인</DialogButton.Secondary>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const WithSrOnlyTitle: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger className="rounded bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-700">
        srTitle을 활용한 다이얼로그
      </DialogTrigger>
      <DialogContent>
        <DialogBody srTitle="게임 삭제 확인">
          정말로 이 게임을 삭제하시겠습니까? 삭제된 게임은 복구할 수 없습니다.
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <DialogButton.Secondary>취소</DialogButton.Secondary>
          </DialogClose>
          <DialogClose asChild>
            <DialogButton.Destructive>삭제</DialogButton.Destructive>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: `
**접근성 향상을 위한 srTitle 사용 예시**

DialogHeader가 없는 경우, 스크린 리더 사용자를 위해 \`srTitle\` prop을 사용할 수 있습니다.

- \`srTitle\`은 시각적으로는 보이지 않지만 스크린 리더가 읽을 수 있는 제목을 제공합니다
- DialogHeader가 존재하면 srTitle은 무시됩니다

\`\`\`tsx
<DialogBody srTitle="게임 삭제 확인">
  정말로 이 게임을 삭제하시겠습니까?
</DialogBody>
\`\`\`

개발자 도구에서 Elements 탭을 확인하면 \`sr-only\` 클래스가 적용된 숨겨진 제목 요소를 볼 수 있습니다.
        `,
      },
    },
  },
}

import { useDialog } from "../components/dialog/useDialog"

const UseDialogOpenExample = () => {
  const dialog = useDialog()

  const handleClick = () => {
    dialog.open({
      title: "게임을 삭제하시겠습니까?",
      body: "삭제된 게임은 복구할 수 없습니다.",
      destructive: {
        label: "삭제",
        onClick: () => console.log("삭제됨"),
      },
      secondary: { label: "취소" },
    })
  }

  return (
    <button
      onClick={handleClick}
      className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
    >
      useDialog.open 예시
    </button>
  )
}

export const UseDialogOpen: Story = {
  render: () => <UseDialogOpenExample />,
  parameters: {
    docs: {
      description: {
        story:
          "`dialog.open()` - 콜백 방식. 버튼의 `onClick`에서 액션을 처리합니다.",
      },
    },
  },
}

const UseDialogOpenAsyncExample = () => {
  const dialog = useDialog()

  const handleClick = async () => {
    const confirmed = await dialog.openAsync({
      title: "이 게임을 복제하시겠습니까?",
      body: "선택한 게임이 복제되어, 곧바로 편집 화면으로 이동합니다.",
      primary: { label: "네" },
      secondary: { label: "아니요" },
    })

    if (confirmed) {
      console.log("복제 진행")
    } else {
      console.log("취소됨")
    }
  }

  return (
    <button
      onClick={handleClick}
      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
    >
      useDialog.openAsync 예시
    </button>
  )
}

export const UseDialogOpenAsync: Story = {
  render: () => <UseDialogOpenAsyncExample />,
  parameters: {
    docs: {
      description: {
        story:
          "`dialog.openAsync()` - Promise 반환. `primary`/`destructive` 클릭 시 `true`, `secondary`/배경 클릭 시 `false`.",
      },
    },
  },
}
