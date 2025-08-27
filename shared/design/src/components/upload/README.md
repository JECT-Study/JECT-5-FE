# FileUpload Component

파일 업로드 기능을 제공하는 접근성 친화적인 React 컴포넌트입니다.

## 🎯 주요 기능

- **드래그 앤 드롭**: 파일을 드래그하여 업로드
- **클립보드 붙여넣기**: 복사된 파일을 붙여넣기로 업로드
- **파일 검증**: 크기, 개수, 형식 검증
- **진행률 표시**: 업로드 진행 상황 시각화
- **접근성 지원**: 스크린 리더 및 키보드 네비게이션 지원

## ♿ 접근성 기능

### ARIA 속성

모든 컴포넌트는 WCAG 2.1 AA 기준을 준수하는 ARIA 속성을 포함합니다:

#### FileUploadRoot
```tsx
<div role="region" aria-label="파일 업로드">
  <input 
    type="file" 
    aria-label="파일 선택"
    aria-labelledby={labelId}
    aria-describedby={dropzoneId}
  />
</div>
```

#### FileUploadDropzone
```tsx
<div 
  role="region" 
  aria-label="파일 드래그 앤 드롭 영역"
  aria-controls={`${inputId} ${listId}`}
  tabIndex={0}
>
  {/* 드래그 앤 드롭 영역 */}
</div>
```

#### FileUploadList
```tsx
<div role="list" aria-label="업로드된 파일 목록">
  {/* 파일 아이템들 */}
</div>
```

#### FileUploadItem
```tsx
<div 
  role="listitem" 
  aria-label={`파일: ${fileName}`}
  aria-setsize={fileCount}
  aria-posinset={fileIndex}
>
  {/* 파일 정보 */}
</div>
```

#### FileUploadItemProgress
```tsx
<div
  role="progressbar"
  aria-label={`${fileName} 업로드 진행률`}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={progress}
  aria-valuetext={`${progress}% 완료`}
>
  {/* 진행률 표시 */}
</div>
```

#### FileUploadItemDelete
```tsx
<button
  type="button"
  aria-label={`${fileName} 삭제`}
  aria-describedby={messageId}
>
  {/* 삭제 아이콘 */}
</button>
```

#### FileUploadClear
```tsx
<button
  type="button"
  aria-label={`전체 파일 ${fileCount}개 삭제`}
>
  {/* 전체 삭제 */}
</button>
```

#### FileUploadItemMetadata
```tsx
<span aria-label={`파일명: ${fileName}`}>{fileName}</span>
<span aria-label={`파일 크기: ${fileSize}`}>{fileSize}</span>
{error && (
  <span 
    role="alert"
    aria-label={`업로드 오류: ${error}`}
  >
    {error}
  </span>
)}
```

### 키보드 네비게이션

- **Tab**: 모든 상호작용 요소를 순차적으로 탐색
- **Enter/Space**: 버튼 활성화, 파일 선택
- **드롭존 포커스**: Enter/Space로 파일 선택 다이얼로그 열기

### 스크린 리더 지원

- **파일 목록**: `role="list"`와 `role="listitem"`으로 구조화
- **진행률**: `role="progressbar"`와 `aria-valuenow`로 진행 상황 전달
- **상태 변경**: `role="alert"`로 오류 메시지 즉시 알림
- **버튼 라벨**: 모든 버튼에 의미 있는 `aria-label` 제공

## 📖 사용법

### 기본 사용법

```tsx
import { FileUpload } from '@ject-5-fe/design/components/upload'

function MyComponent() {
  const [files, setFiles] = useState<File[]>([])

  return (
    <FileUpload
      value={files}
      onChange={setFiles}
      accept=".jpg,.png,.pdf"
      maxFiles={5}
      maxSize={10 * 1024 * 1024} // 10MB
      label="문서 업로드"
    >
      <FileUpload.Dropzone>
        <p>파일을 여기에 드래그하세요</p>
      </FileUpload.Dropzone>
      <FileUpload.List>
        {files.map((file) => (
          <FileUpload.Item key={file.name} value={file}>
            <FileUpload.ItemMetadata />
            <FileUpload.ItemProgress />
            <FileUpload.ItemDelete />
          </FileUpload.Item>
        ))}
      </FileUpload.List>
      <FileUpload.Clear />
    </FileUpload>
  )
}
```

### 고급 사용법

```tsx
import { FileUpload } from '@ject-5-fe/design/components/upload'

function AdvancedUpload() {
  const [files, setFiles] = useState<File[]>([])

  const handleUpload = async (files: File[], options: {
    onProgress: (file: File, progress: number) => void
    onSuccess: (file: File) => void
    onError: (file: File, error: Error) => void
  }) => {
    for (const file of files) {
      try {
        // 업로드 로직
        for (let progress = 0; progress <= 100; progress += 10) {
          options.onProgress(file, progress)
          await new Promise(resolve => setTimeout(resolve, 100))
        }
        options.onSuccess(file)
      } catch (error) {
        options.onError(file, error as Error)
      }
    }
  }

  return (
    <FileUpload
      value={files}
      onChange={setFiles}
      onUpload={handleUpload}
      accept="image/*"
      multiple
      maxFiles={10}
      maxSize={5 * 1024 * 1024} // 5MB
      label="이미지 업로드"
    >
      <FileUpload.Dropzone className="border-2 border-dashed p-8">
        <div className="text-center">
          <p className="text-lg font-medium">이미지를 드래그하세요</p>
          <p className="text-sm text-gray-500">또는 클릭하여 선택하세요</p>
        </div>
      </FileUpload.Dropzone>
      
      <FileUpload.List className="mt-4 space-y-2">
        {files.map((file) => (
          <FileUpload.Item 
            key={file.name} 
            value={file}
            className="flex items-center justify-between p-3 border rounded"
          >
            <FileUpload.ItemMetadata />
            <div className="flex items-center gap-2">
              <FileUpload.ItemProgress variant="circular" size={24} />
              <FileUpload.ItemDelete />
            </div>
          </FileUpload.Item>
        ))}
      </FileUpload.List>
      
      {files.length > 0 && (
        <FileUpload.Clear className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
          전체 삭제
        </FileUpload.Clear>
      )}
    </FileUpload>
  )
}
```

## 🧪 E2E 테스트 예시

접근성 기반 셀렉터를 사용한 Playwright 테스트:

```typescript
import { test, expect } from '@playwright/test'

test('파일 업로드 기능', async ({ page }) => {
  await page.goto('/upload')

  // 드롭존 클릭
  await page.getByRole('region', { name: '파일 드래그 앤 드롭 영역' }).click()
  
  // 파일 선택
  await page.getByRole('button', { name: '파일 선택' }).click()
  
  // 파일 업로드 후 목록 확인
  await expect(page.getByRole('list', { name: '업로드된 파일 목록' })).toBeVisible()
  await expect(page.getByRole('listitem', { name: /파일:/ })).toHaveCount(1)
  
  // 진행률 확인
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  
  // 파일 삭제
  await page.getByRole('button', { name: /삭제/ }).click()
  await expect(page.getByRole('listitem')).toHaveCount(0)
})
```

## 📋 Props

### FileUploadRoot

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `File[]` | - | 제어된 파일 목록 |
| `onChange` | `(files: File[]) => void` | - | 파일 목록 변경 콜백 |
| `accept` | `string` | - | 허용할 파일 형식 |
| `maxFiles` | `number` | - | 최대 파일 개수 |
| `maxSize` | `number` | - | 최대 파일 크기 (bytes) |
| `disabled` | `boolean` | `false` | 비활성화 상태 |
| `multiple` | `boolean` | `false` | 다중 파일 선택 |
| `required` | `boolean` | `false` | 필수 입력 |
| `label` | `string` | `"파일 업로드"` | 접근성 라벨 |
| `onUpload` | `(files, options) => Promise<void>` | - | 업로드 처리 함수 |

### FileUploadDropzone

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | 자식 요소로 렌더링 |
| `className` | `string` | - | CSS 클래스 |

### FileUploadList

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | 목록 방향 |
| `forceMount` | `boolean` | `false` | 강제 마운트 |

### FileUploadItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `File` | - | 파일 객체 |
| `asChild` | `boolean` | `false` | 자식 요소로 렌더링 |

### FileUploadItemProgress

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"linear" \| "circular" \| "fill"` | `"linear"` | 진행률 표시 방식 |
| `size` | `number` | `40` | 크기 (circular variant) |
| `forceMount` | `boolean` | `false` | 강제 마운트 |

## 🎨 스타일링

모든 컴포넌트는 `className` prop을 통해 스타일링이 가능합니다:

```tsx
<FileUpload.Dropzone className="border-2 border-dashed border-gray-300 rounded-lg p-8">
  <p className="text-center text-gray-600">파일을 드래그하세요</p>
</FileUpload.Dropzone>
```

## 🔧 접근성 검증

### 스크린 리더 테스트

1. **파일 목록 탐색**: 스크린 리더가 파일 목록을 올바르게 읽는지 확인
2. **진행률 알림**: 업로드 진행률이 정확히 전달되는지 확인
3. **오류 메시지**: 오류 발생 시 즉시 알림되는지 확인
4. **버튼 라벨**: 모든 버튼의 기능이 명확히 전달되는지 확인

### 키보드 네비게이션 테스트

1. **Tab 순서**: 논리적인 순서로 포커스가 이동하는지 확인
2. **Enter/Space**: 모든 버튼이 키보드로 활성화되는지 확인
3. **드롭존**: Enter/Space로 파일 선택이 가능한지 확인

### 자동화 테스트

```typescript
// 접근성 검증 테스트
test('접근성 속성 검증', async ({ page }) => {
  await page.goto('/upload')
  
  // ARIA 속성 확인
  await expect(page.getByRole('region', { name: '파일 업로드' })).toBeVisible()
  await expect(page.getByRole('region', { name: '파일 드래그 앤 드롭 영역' })).toBeVisible()
  
  // 진행률 속성 확인
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuemin', '0')
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100')
})
```

## 📚 관련 문서

- [WCAG 2.1 AA 가이드라인](https://www.w3.org/WAI/WCAG21/AA/)
- [ARIA 명세](https://www.w3.org/TR/wai-aria/)
- [Playwright 접근성 테스트](https://playwright.dev/docs/accessibility-testing)
