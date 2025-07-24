import {
  Add,
  Arrow,
  Cross,
  Edit,
  Hidden,
  Iconplaceholder_16px,
  Iconplaceholder_24px,
  Iconplaceholder_28px,
  Iconplaceholder_32px,
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

export default {
  title: "Icons",
  component: () => null,
  parameters: {
    docs: {
      description: {
        component: `
# Icon Components

디자인 시스템에서 사용되는 모든 아이콘 컴포넌트들입니다.
리액트 컴포넌트로 변환이 되었기 때문에, 피그마의 아이콘 네임으로 import하여 바로 사용할 수 있습니다.

## 📋 기본 정보

- **기본 크기**: 24×24px (모든 아이콘의 기본 사이즈)
- **크기 변경**: 필요 시 \`className="size-*"\`로 변경 가능
- **색상 적용**: \`className\` prop을 통해 색상 적용

## 📦 사용법

\`\`\`tsx
import { Add, Arrow, Cross } from "@ject-5-fe/design/icons"

// 기본 사용법 (24×24px)
<Add />

// 크기 변경
<Add className="size-4" />  // 16px
<Add className="size-6" />  // 24px  
<Add className="size-8" />  // 32px

// 색상 적용
<Add className="text-blue-500" />
<Arrow className="text-red-500 size-8" />
\`\`\`

## 🎨 크기 옵션

| className | 크기 |
|-----------|------|
| \`size-4\` | 16×16px |
| \`size-6\` | 24×24px (기본) |
| \`size-7\` | 28×28px |
| \`size-8\` | 32×32px |

## 🎯 색상 적용

Tailwind CSS의 색상 클래스를 사용하여 아이콘 색상을 변경할 수 있습니다:

- \`text-black\`, \`text-white\`
- \`text-gray-500\`, \`text-blue-500\` 등
- 커스텀 색상 토큰 사용 가능

## 📝 아이콘 목록

아래 스토리에서 모든 사용 가능한 아이콘들을 확인할 수 있습니다.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: [16, 24, 28, 32],
      defaultValue: 24,
      description: "아이콘 크기 (px)",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "24" },
      },
    },
    color: {
      control: { type: "select" },
      options: [
        "text-black",
        "text-gray-500",
        "text-blue-500",
        "text-red-500",
        "text-green-500",
      ],
      defaultValue: "text-black",
      description: "아이콘 색상 클래스",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "text-black" },
      },
    },
  },
}

const icons = [
  { name: "Add", component: Add },
  { name: "Arrow", component: Arrow },
  { name: "Cross", component: Cross },
  { name: "Edit", component: Edit },
  { name: "Hidden", component: Hidden },
  { name: "Iconplaceholder 16px", component: Iconplaceholder_16px },
  { name: "Iconplaceholder 24px", component: Iconplaceholder_24px },
  { name: "Iconplaceholder 28px", component: Iconplaceholder_28px },
  { name: "Iconplaceholder 32px", component: Iconplaceholder_32px },
  { name: "Magnifier", component: Magnifier },
  { name: "Minus", component: Minus },
  { name: "MoreDot", component: MoreDot },
  { name: "Play", component: Play },
  { name: "Show", component: Show },
  { name: "Sun", component: Sun },
  { name: "Trash", component: Trash },
  { name: "Unshare", component: Unshare },
  { name: "Upload", component: Upload },
]

export const AllIcons = ({ size = 24, color = "text-black" }) => (
  <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 p-5">
    {icons.map(({ name, component: IconComponent }) => (
      <div
        key={name}
        className="flex flex-col items-center rounded-lg border border-gray-200 p-4"
      >
        <IconComponent size={size} className={color} />
        <span className="mt-2 text-sm font-medium">{name}</span>
      </div>
    ))}
  </div>
)

AllIcons.parameters = {
  docs: {
    description: {
      story: `
모든 사용 가능한 아이콘들을 한 번에 볼 수 있습니다.

**기능:**
- 실시간 크기 조절 (16px ~ 32px)
- 색상 변경 테스트
- 아이콘 이름 표시

**사용법:** 컨트롤 패널에서 크기와 색상을 조절해보세요.
      `,
    },
  },
}

AllIcons.args = {
  size: 24,
  color: "text-black",
}

export const ColorTests = () => (
  <div className="space-y-6 p-5">
    <h3 className="text-lg font-semibold">Color Injection Tests</h3>
    {[
      "text-black",
      "text-gray-500",
      "text-blue-500",
      "text-red-500",
      "text-green-500",
    ].map((colorClass) => (
      <div key={colorClass} className="space-y-3">
        <h4 className="font-medium">{colorClass}</h4>
        <div className="flex flex-wrap gap-4">
          {icons.slice(0, 5).map(({ name, component: IconComponent }) => (
            <div
              key={name}
              className="flex flex-col items-center rounded border border-gray-200 p-3"
            >
              <IconComponent size={24} className={colorClass} />
              <span className="mt-1 text-xs">{name}</span>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

ColorTests.parameters = {
  docs: {
    description: {
      story: `
다양한 색상 클래스가 아이콘에 어떻게 적용되는지 확인할 수 있습니다.

**테스트 색상:**
- \`text-black\`: 기본 검정색
- \`text-gray-500\`: 회색 (중간 톤)
- \`text-blue-500\`: 파란색
- \`text-red-500\`: 빨간색
- \`text-green-500\`: 초록색

**활용:** 원하는 색상 클래스를 복사해서 프로젝트에 적용하세요.
      `,
    },
  },
}

export const SizeTests = () => (
  <div className="space-y-6 p-5">
    <h3 className="text-lg font-semibold">Size Injection Tests</h3>
    {[16, 24, 28, 32].map((size) => (
      <div key={size} className="space-y-3">
        <h4 className="font-medium">Size: {size}px</h4>
        <div className="flex flex-wrap gap-4">
          {icons.slice(0, 5).map(({ name, component: IconComponent }) => (
            <div
              key={name}
              className="flex flex-col items-center rounded border border-gray-200 p-3"
            >
              <IconComponent size={size} className="text-black" />
              <span className="mt-1 text-xs">{name}</span>
              <code className="text-xs text-gray-500">
                size-
                {size === 16
                  ? "4"
                  : size === 24
                    ? "6"
                    : size === 28
                      ? "7"
                      : "8"}
              </code>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

SizeTests.parameters = {
  docs: {
    description: {
      story: `
아이콘의 다양한 크기를 테스트할 수 있습니다.

**크기 옵션:**
- **16px**: \`className="size-4"\` - 작은 버튼, 인라인 텍스트용
- **24px**: \`className="size-6"\` - 기본 크기 (권장)
- **28px**: \`className="size-7"\` - 중간 크기 버튼용  
- **32px**: \`className="size-8"\` - 큰 버튼, 헤더용

**참고:** 24×24px가 기본 크기이므로, 대부분의 경우 추가 클래스 없이 사용 가능합니다.
      `,
    },
  },
}
