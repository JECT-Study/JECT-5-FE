import {
  createContext,
  createElement,
  type Dispatch,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react"

import type { StoreAction, StoreState } from "../types"

function fileUploadReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case "ADD_FILES": {
      const newFiles = new Map(state.files)
      for (const file of action.files) {
        newFiles.set(file, {
          file,
          progress: 0,
          status: "idle",
        })
      }
      return { ...state, files: newFiles }
    }

    case "SET_FILES": {
      const newFiles = new Map()
      for (const file of action.files) {
        const existingState = state.files.get(file)
        if (existingState) {
          newFiles.set(file, existingState)
        } else {
          newFiles.set(file, {
            file,
            progress: 0,
            status: "idle",
          })
        }
      }
      return { ...state, files: newFiles }
    }

    case "SET_PROGRESS": {
      const newFiles = new Map(state.files)
      const fileState = newFiles.get(action.file)
      if (fileState) {
        newFiles.set(action.file, {
          ...fileState,
          progress: action.progress,
          status: "uploading",
        })
      }
      return { ...state, files: newFiles }
    }

    case "SET_SUCCESS": {
      const newFiles = new Map(state.files)
      const fileState = newFiles.get(action.file)
      if (fileState) {
        newFiles.set(action.file, {
          ...fileState,
          progress: 100,
          status: "success",
        })
      }
      return { ...state, files: newFiles }
    }

    case "SET_ERROR": {
      const newFiles = new Map(state.files)
      const fileState = newFiles.get(action.file)
      if (fileState) {
        newFiles.set(action.file, {
          ...fileState,
          error: action.error,
          status: "error",
        })
      }
      return { ...state, files: newFiles }
    }

    case "REMOVE_FILE": {
      const newFiles = new Map(state.files)
      newFiles.delete(action.file)
      return { ...state, files: newFiles }
    }

    case "SET_DRAG_OVER": {
      return { ...state, dragOver: action.dragOver }
    }

    case "SET_INVALID": {
      return { ...state, invalid: action.invalid }
    }

    case "CLEAR": {
      return { ...state, files: new Map(), invalid: false }
    }

    default:
      return state
  }
}

// Context 생성
const FileUploadStoreContext = createContext<{
  state: StoreState
  dispatch: Dispatch<StoreAction>
  getFiles: () => File[]
  addFiles: (files: File[]) => void
  removeFile: (file: File) => void
  setProgress: (file: File, progress: number) => void
  setSuccess: (file: File) => void
  setError: (file: File, error: string) => void
  clear: () => void
  setDragOver: (dragOver: boolean) => void
  setInvalid: (invalid: boolean) => void
} | null>(null)

// Provider 컴포넌트
export function FileUploadStoreProvider({
  children,
  onValueChange,
}: {
  children: ReactNode
  onValueChange?: (files: File[]) => void
}) {
  const [state, dispatch] = useReducer(fileUploadReducer, {
    files: new Map(),
    dragOver: false,
    invalid: false,
  })

  // 파일 목록 변경 시 콜백 호출
  useEffect(() => {
    if (onValueChange) {
      const files = Array.from(state.files.values()).map((f) => f.file)
      onValueChange(files)
    }
  }, [state.files, onValueChange])

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      getFiles: () => Array.from(state.files.values()).map((f) => f.file),
      addFiles: (files: File[]) => dispatch({ type: "ADD_FILES", files }),
      removeFile: (file: File) => dispatch({ type: "REMOVE_FILE", file }),
      setProgress: (file: File, progress: number) =>
        dispatch({ type: "SET_PROGRESS", file, progress }),
      setSuccess: (file: File) => dispatch({ type: "SET_SUCCESS", file }),
      setError: (file: File, error: string) =>
        dispatch({ type: "SET_ERROR", file, error }),
      clear: () => dispatch({ type: "CLEAR" }),
      setDragOver: (dragOver: boolean) =>
        dispatch({ type: "SET_DRAG_OVER", dragOver }),
      setInvalid: (invalid: boolean) =>
        dispatch({ type: "SET_INVALID", invalid }),
    }),
    [state],
  )

  return createElement(
    FileUploadStoreContext.Provider,
    { value: contextValue },
    children,
  )
}

// Hook
export function useFileUploadStore() {
  const context = useContext(FileUploadStoreContext)
  if (!context) {
    throw new Error(
      `useFileUploadStore must be used within FileUploadStoreProvider`,
    )
  }
  return context
}

// 선택적 상태 구독을 위한 hook (성능 최적화)
export function useFileUploadSelector<T>(
  selector: (state: StoreState) => T,
): T {
  const { state } = useFileUploadStore()
  return useMemo(() => selector(state), [state, selector])
}

// 하위 호환성을 위한 기존 함수들
export function useStoreContext(_consumerName: string) {
  return useFileUploadStore()
}

export function useStore<T>(selector: (state: StoreState) => T): T {
  return useFileUploadSelector(selector)
}

// 더 이상 사용하지 않는 함수들 (하위 호환성)
export function createStore() {
  console.warn("createStore is deprecated, use FileUploadStoreProvider instead")
  return null
}

export const StoreContext = FileUploadStoreContext
