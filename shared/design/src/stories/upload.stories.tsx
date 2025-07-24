import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { fn } from "storybook/test"

import {
  Dropzone,
  FileUpload,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadList,
  Trigger,
} from "../components/upload"

const meta = {
  title: "Components/Upload",
  component: FileUpload,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
# File Upload Component

파일 업로드 기능을 제공하는 합성 컴포넌트입니다. 드래그 앤 드롭, 파일 검증, 진행률 추적 등의 기능을 지원합니다.

## 컴포넌트 구조

### 🏗️ 합성 컴포넌트 패턴
이 컴포넌트는 합성 컴포넌트 패턴을 사용하여 각 부분을 독립적으로 구성할 수 있습니다:

- **FileUpload**: 루트 컨테이너, 전체 상태 관리
- **Dropzone**: 드래그 앤 드롭 영역, 파일 선택 영역  
- **Trigger**: 파일 선택을 트리거하는 버튼 영역
- **FileUploadList**: 업로드된 파일 목록 컨테이너
- **FileUploadItem**: 개별 파일 아이템
- **FileUploadItemMetadata**: 파일명, 크기 등 메타데이터 표시
- **FileUploadItemDelete**: 파일 삭제 버튼

## 기본 사용법

\`\`\`tsx
import {
  FileUpload,
  Dropzone,
  Trigger,
  FileUploadList,
  FileUploadItem,
  FileUploadItemMetadata,
  FileUploadItemDelete,
} from "@/components/ui/upload"

function MyUploadComponent() {
  const [files, setFiles] = React.useState<File[]>([])

  return (
    <FileUpload
      value={files}
      onValueChange={setFiles}
      accept="image/*"
      maxFiles={5}
      multiple
    >
      <Dropzone>
        <div className="text-center">
          <p>파일을 드래그하거나 클릭하여 선택하세요</p>
        </div>
        <Trigger>
          <button>파일 선택</button>
        </Trigger>
      </Dropzone>
      
      <FileUploadList>
        {files.map((file) => (
          <FileUploadItem key={file.name} value={file}>
            <FileUploadItemMetadata />
            <FileUploadItemDelete>
              <button>삭제</button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  )
}
\`\`\`

## 주요 기능

- ✅ **드래그 앤 드롭**: 파일을 드래그하여 업로드 가능
- ✅ **파일 검증**: 파일 타입, 크기, 개수 제한
- ✅ **진행률 추적**: 업로드 진행 상황 표시
- ✅ **접근성**: 스크린 리더 지원
- ✅ **커스터마이징**: 각 부분을 독립적으로 스타일링 가능
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    accept: {
      control: "text",
      description: "허용할 파일 타입 (예: image/*, .pdf, .doc)",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    maxFiles: {
      control: "number",
      description: "최대 업로드 가능한 파일 수",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "undefined" },
      },
    },
    maxSize: {
      control: "number",
      description: "파일 최대 크기 (bytes)",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "undefined" },
      },
    },
    multiple: {
      control: "boolean",
      description: "다중 파일 선택 허용",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    disabled: {
      control: "boolean",
      description: "컴포넌트 비활성화",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    required: {
      control: "boolean",
      description: "필수 입력 여부",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
  args: {
    onValueChange: fn(),
    onAccept: fn(),
    onFileAccept: fn(),
    onFileReject: fn(),
  },
} satisfies Meta<typeof FileUpload>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: `
기본적인 파일 업로드 컴포넌트입니다. 이미지 파일만 업로드 가능하며, 최대 2개까지 선택할 수 있습니다.

**특징:**
- 드래그 앤 드롭 지원
- 파일 타입 검증 (이미지만)
- 파일 크기 제한 (2MB)
- 최대 파일 개수 제한 (2개)
        `,
      },
    },
  },
  render: (args) => {
    const [files, setFiles] = React.useState<File[]>([])

    const onFileValidate = React.useCallback(
      (file: File): string | null => {
        if (files.length >= 2) {
          return "최대 2개 파일까지 업로드 가능합니다"
        }

        if (!file.type.startsWith("image/")) {
          return "이미지 파일만 업로드 가능합니다"
        }

        const MAX_SIZE = 2 * 1024 * 1024 // 2MB
        if (file.size > MAX_SIZE) {
          return `파일 크기는 ${MAX_SIZE / (1024 * 1024)}MB 이하여야 합니다`
        }

        return null
      },
      [files],
    )

    const onFileReject = React.useCallback((file: File, message: string) => {
      console.log(`파일 거부됨: ${message}`, file.name)
    }, [])

    return (
      <FileUpload
        {...args}
        value={files}
        onValueChange={setFiles}
        onFileValidate={onFileValidate}
        onFileReject={onFileReject}
        accept="image/*"
        maxFiles={2}
        className="w-full max-w-md"
        multiple
      >
        <Dropzone>
          <Trigger>
            <div className="flex flex-col items-center justify-center gap-[22px] text-text-interactive-tertiary">
              <div className="typography-heading-lg-semibold">파일 업로드</div>
              <div className="typography-heading-sm-medium">
                JPG, JPEG, PNG (최대 2MB)
              </div>
            </div>
          </Trigger>
        </Dropzone>
        <FileUploadList className="mt-4">
          {files.map((file) => (
            <FileUploadItem
              key={file.name}
              value={file}
              className="mb-2 flex items-center justify-between border-b pb-2"
            >
              <FileUploadItemMetadata />
              <FileUploadItemDelete>
                <button className="ml-2 rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600">
                  삭제
                </button>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>
      </FileUpload>
    )
  },
  args: {
    multiple: true,
    maxFiles: 2,
  },
}

export const SingleFile: Story = {
  parameters: {
    docs: {
      description: {
        story: `
단일 파일만 업로드할 수 있는 버전입니다. 프로필 이미지 업로드 등에 적합합니다.

**특징:**
- 하나의 파일만 선택 가능
- 새 파일 선택 시 기존 파일 자동 교체
        `,
      },
    },
  },
  render: (args) => {
    const [files, setFiles] = React.useState<File[]>([])

    return (
      <FileUpload
        {...args}
        value={files}
        onValueChange={setFiles}
        accept="image/*"
        maxFiles={1}
        className="w-full max-w-md"
        multiple={false}
      >
        <Dropzone>
          <Trigger>
            <div className="flex flex-col items-center justify-center gap-[22px] text-text-interactive-tertiary">
              <div className="typography-heading-lg-semibold">
                프로필 이미지
              </div>
              <div className="typography-heading-sm-medium">
                JPG, PNG (최대 1개)
              </div>
            </div>
          </Trigger>
        </Dropzone>
        <FileUploadList className="mt-4">
          {files.map((file) => (
            <FileUploadItem
              key={file.name}
              value={file}
              className="mb-2 flex items-center justify-between border-b pb-2"
            >
              <FileUploadItemMetadata />
              <FileUploadItemDelete>
                <button className="ml-2 rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600">
                  삭제
                </button>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>
      </FileUpload>
    )
  },
  args: {
    multiple: false,
    maxFiles: 1,
  },
}

export const AllFileTypes: Story = {
  parameters: {
    docs: {
      description: {
        story: `
모든 파일 타입을 허용하는 버전입니다. 문서, 이미지, 동영상 등 다양한 파일을 업로드할 수 있습니다.

**특징:**
- 모든 파일 타입 허용
- 최대 5개 파일까지
- 파일 크기 제한 없음
        `,
      },
    },
  },
  render: (args) => {
    const [files, setFiles] = React.useState<File[]>([])

    return (
      <FileUpload
        {...args}
        value={files}
        onValueChange={setFiles}
        maxFiles={5}
        className="w-full max-w-md"
        multiple
      >
        <Dropzone>
          <Trigger>
            <div className="flex flex-col items-center justify-center gap-[22px] text-text-interactive-tertiary">
              <div className="typography-heading-lg-semibold">파일 업로드</div>
              <div className="typography-heading-sm-medium">
                모든 파일 타입 (최대 5개)
              </div>
            </div>
          </Trigger>
        </Dropzone>
        <FileUploadList className="mt-4">
          {files.map((file) => (
            <FileUploadItem
              key={file.name}
              value={file}
              className="mb-2 flex items-center justify-between border-b pb-2"
            >
              <FileUploadItemMetadata />
              <FileUploadItemDelete>
                <button className="ml-2 rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600">
                  삭제
                </button>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>
      </FileUpload>
    )
  },
  args: {
    multiple: true,
    maxFiles: 5,
  },
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: `
비활성화된 상태의 파일 업로드 컴포넌트입니다. 조건에 따라 업로드를 제한할 때 사용합니다.

**특징:**
- 모든 인터랙션 비활성화
- 시각적으로 비활성 상태 표시
        `,
      },
    },
  },
  render: (args) => {
    const [files, setFiles] = React.useState<File[]>([])

    return (
      <FileUpload
        {...args}
        value={files}
        onValueChange={setFiles}
        disabled
        className="w-full max-w-md"
      >
        <Dropzone>
          <Trigger>
            <div className="flex flex-col items-center justify-center gap-[22px] text-text-interactive-tertiary opacity-50">
              <div className="typography-heading-lg-semibold">파일 업로드</div>
              <div className="typography-heading-sm-medium">
                업로드 기능이 비활성화되었습니다
              </div>
            </div>
          </Trigger>
        </Dropzone>
      </FileUpload>
    )
  },
  args: {
    disabled: true,
  },
}
