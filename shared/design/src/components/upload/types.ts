import * as React from "react"

// ==================== Core Types ====================

/** 파일 업로드 상태 */
export type FileUploadStatus = "idle" | "uploading" | "error" | "success"

/** 텍스트 방향 */
export type Direction = "ltr" | "rtl"

/** 개별 파일의 상태 정보 */
export interface FileState {
  /** 업로드할 파일 */
  file: File
  /** 업로드 진행률 (0-100) */
  progress: number
  /** 에러 메시지 (에러 발생 시) */
  error?: string
  /** 파일 업로드 상태 */
  status: FileUploadStatus
}

// ==================== Store Types ====================

/** 파일 업로드 스토어 전체 상태 */
export interface StoreState {
  /** 파일별 상태 맵 */
  files: Map<File, FileState>
  /** 드래그 오버 상태 */
  dragOver: boolean
  /** 유효성 검사 실패 상태 */
  invalid: boolean
}

/** 스토어 액션 타입들 */
export type StoreAction =
  | { type: "ADD_FILES"; files: File[] }
  | { type: "SET_FILES"; files: File[] }
  | { type: "SET_PROGRESS"; file: File; progress: number }
  | { type: "SET_SUCCESS"; file: File }
  | { type: "SET_ERROR"; file: File; error: string }
  | { type: "REMOVE_FILE"; file: File }
  | { type: "SET_DRAG_OVER"; dragOver: boolean }
  | { type: "SET_INVALID"; invalid: boolean }
  | { type: "CLEAR" }

/** 스토어 인스턴스 인터페이스 */
export interface FileUploadStore {
  getState: () => StoreState
  dispatch: (action: StoreAction) => void
  subscribe: (listener: () => void) => () => void
}

// ==================== Upload Callbacks ====================

/** 업로드 진행률 콜백 */
export type UploadProgressCallback = (file: File, progress: number) => void

/** 업로드 성공 콜백 */
export type UploadSuccessCallback = (file: File) => void

/** 업로드 에러 콜백 */
export type UploadErrorCallback = (file: File, error: Error) => void

/** 업로드 함수에 전달되는 옵션 */
export interface UploadOptions {
  onProgress: UploadProgressCallback
  onSuccess: UploadSuccessCallback
  onError: UploadErrorCallback
}

/** 업로드 함수 타입 */
export type UploadFunction = (
  files: File[],
  options: UploadOptions,
) => Promise<void> | void

// ==================== Validation ====================

/** 파일 검증 함수 타입 */
export type FileValidator = (file: File) => string | null | undefined

/** 파일 검증 규칙 */
export interface ValidationRules {
  /** 허용되는 파일 타입 (예: "image/*", ".jpg,.png") */
  accept?: string
  /** 최대 파일 개수 */
  maxFiles?: number
  /** 최대 파일 크기 (bytes) */
  maxSize?: number
  /** 커스텀 검증 함수 */
  validator?: FileValidator
}

// ==================== Context Types ====================

/** FileUpload 컨텍스트 값 */
export interface FileUploadContextValue {
  dropzoneId: string
  inputId: string
  listId: string
  labelId: string
  dir: Direction
  disabled: boolean
  inputRef: React.RefObject<HTMLInputElement>
  urlCache: WeakMap<File, string>
}

/** FileUploadItem 컨텍스트 값 */
export interface FileUploadItemContextValue {
  id: string
  nameId: string
  sizeId: string
  statusId: string
  messageId: string
  fileState: FileState | null
}

// ==================== Component Props ====================

/** FileUpload Root 컴포넌트 Props */
export interface FileUploadRootProps
  extends Omit<
    React.ComponentPropsWithoutRef<"div">,
    "defaultValue" | "onChange"
  > {
  /** 제어된 모드의 파일 배열 */
  value?: File[]
  /** 기본 파일 배열 */
  defaultValue?: File[]
  /** 파일 변경 시 호출되는 콜백 */
  onValueChange?: (files: File[]) => void
  /** 파일 수락 시 호출되는 콜백 */
  onAccept?: (files: File[]) => void
  /** 개별 파일 수락 시 호출되는 콜백 */
  onFileAccept?: (file: File) => void
  /** 개별 파일 거부 시 호출되는 콜백 */
  onFileReject?: (file: File, message: string) => void
  /** 파일 검증 함수 */
  onFileValidate?: FileValidator
  /** 업로드 함수 */
  onUpload?: UploadFunction
  /** 허용되는 파일 타입 */
  accept?: string
  /** 최대 파일 개수 */
  maxFiles?: number
  /** 최대 파일 크기 (bytes) */
  maxSize?: number
  /** 텍스트 방향 */
  dir?: Direction
  /** 접근성 라벨 */
  label?: string
  /** input name 속성 */
  name?: string
  /** Radix UI Slot 패턴 사용 여부 */
  asChild?: boolean
  /** 비활성화 상태 */
  disabled?: boolean
  /** 유효성 검사 실패 상태 */
  invalid?: boolean
  /** 다중 파일 선택 허용 */
  multiple?: boolean
  /** 필수 입력 여부 */
  required?: boolean
}

/** FileUpload Dropzone 컴포넌트 Props */
export interface FileUploadDropzoneProps
  extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
}

/** FileUpload Trigger 컴포넌트 Props */
export interface FileUploadTriggerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean
}

/** FileUpload List 컴포넌트 Props */
export interface FileUploadListProps
  extends React.ComponentPropsWithoutRef<"div"> {
  orientation?: "horizontal" | "vertical"
  asChild?: boolean
  forceMount?: boolean
}

/** FileUpload Item 컴포넌트 Props */
export interface FileUploadItemProps
  extends React.ComponentPropsWithoutRef<"div"> {
  value: File
  asChild?: boolean
}

/** FileUpload Item Metadata 컴포넌트 Props */
export interface FileUploadItemMetadataProps
  extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
  size?: "default" | "sm"
}

/** FileUpload Item Progress 컴포넌트 Props */
export interface FileUploadItemProgressProps
  extends React.ComponentPropsWithoutRef<"div"> {
  variant?: "linear" | "circular" | "fill"
  size?: number
  asChild?: boolean
  forceMount?: boolean
}

/** FileUpload Item Delete 컴포넌트 Props */
export interface FileUploadItemDeleteProps
  extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean
}

/** FileUpload Clear 컴포넌트 Props */
export interface FileUploadClearProps
  extends React.ComponentPropsWithoutRef<"button"> {
  /** 파일이 없어도 강제로 렌더링할지 여부 */
  forceMount?: boolean
  asChild?: boolean
}

// ==================== Hook Return Types ====================

/** useDragAndDrop 훅 반환 타입 */
export interface DragAndDropState {
  isDragOver: boolean
  onDragEnter: (event: React.DragEvent) => void
  onDragOver: (event: React.DragEvent) => void
  onDragLeave: (event: React.DragEvent) => void
  onDrop: (event: React.DragEvent) => void
}

/** useFileValidation 훅 반환 타입 */
export interface FileValidationState {
  validateFile: (file: File) => string | null
  validateFiles: (files: File[]) => {
    valid: File[]
    invalid: Array<{ file: File; error: string }>
  }
}

/** useFileUpload 훅 반환 타입 */
export interface FileUploadState {
  files: FileState[]
  dragOver: boolean
  invalid: boolean
  addFiles: (files: File[]) => void
  removeFile: (file: File) => void
  clearFiles: () => void
  setProgress: (file: File, progress: number) => void
  setSuccess: (file: File) => void
  setError: (file: File, error: string) => void
}

// ==================== Component Name Constants ====================

/** 컴포넌트 이름 상수들 */
export const COMPONENT_NAMES = {
  ROOT: "FileUpload",
  DROPZONE: "FileUploadDropzone",
  TRIGGER: "FileUploadTrigger",
  LIST: "FileUploadList",
  ITEM: "FileUploadItem",
  ITEM_METADATA: "FileUploadItemMetadata",
  ITEM_PROGRESS: "FileUploadItemProgress",
  ITEM_DELETE: "FileUploadItemDelete",
  CLEAR: "FileUploadClear",
} as const

// ==================== Utility Types ====================

/** 컴포넌트 이름 타입 */
export type ComponentName =
  (typeof COMPONENT_NAMES)[keyof typeof COMPONENT_NAMES]

/** 파일 상태 맵 타입 */
export type FileStateMap = Map<File, FileState>

/** URL 캐시 타입 */
export type UrlCache = WeakMap<File, string>

/** 리스너 세트 타입 */
export type ListenerSet = Set<() => void>
