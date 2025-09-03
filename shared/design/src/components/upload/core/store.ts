import * as React from "react"

import {
  type FileState,
  type FileUploadStore,
  type StoreAction,
  type StoreState,
} from "../types"

/**
 * 파일 업로드 스토어를 생성하는 함수
 *
 * @param listeners - 상태 변경 시 호출될 리스너들
 * @param files - 파일 상태를 저장할 Map
 * @param urlCache - 파일 URL 캐시를 위한 WeakMap
 * @param invalid - 초기 invalid 상태
 * @param onValueChange - 파일 변경 시 호출될 콜백
 * @returns FileUploadStore 인스턴스
 */
export function createStore(
  listeners: Set<() => void>,
  files: Map<File, FileState>,
  urlCache: WeakMap<File, string>,
  invalid: boolean,
  onValueChange?: (files: File[]) => void,
): FileUploadStore {
  let state: StoreState = {
    files,
    dragOver: false,
    invalid: invalid,
  }

  function reducer(state: StoreState, action: StoreAction): StoreState {
    switch (action.type) {
      case "ADD_FILES": {
        for (const file of action.files) {
          files.set(file, {
            file,
            progress: 0,
            status: "idle",
          })
        }

        if (onValueChange) {
          const fileList = Array.from(files.values()).map(
            (fileState) => fileState.file,
          )
          onValueChange(fileList)
        }
        return { ...state, files }
      }

      case "SET_FILES": {
        const newFileSet = new Set(action.files)
        for (const existingFile of Array.from(files.keys())) {
          if (!newFileSet.has(existingFile)) {
            files.delete(existingFile)
          }
        }

        for (const file of action.files) {
          const existingState = files.get(file)
          if (!existingState) {
            files.set(file, {
              file,
              progress: 0,
              status: "idle",
            })
          }
        }
        return { ...state, files }
      }

      case "SET_PROGRESS": {
        const fileState = files.get(action.file)
        if (fileState) {
          files.set(action.file, {
            ...fileState,
            progress: action.progress,
            status: "uploading",
          })
        }
        return { ...state, files }
      }

      case "SET_SUCCESS": {
        const fileState = files.get(action.file)
        if (fileState) {
          files.set(action.file, {
            ...fileState,
            progress: 100,
            status: "success",
          })
        }
        return { ...state, files }
      }

      case "SET_ERROR": {
        const fileState = files.get(action.file)
        if (fileState) {
          files.set(action.file, {
            ...fileState,
            error: action.error,
            status: "error",
          })
        }
        return { ...state, files }
      }

      case "REMOVE_FILE": {
        if (urlCache) {
          const cachedUrl = urlCache.get(action.file)
          if (cachedUrl) {
            URL.revokeObjectURL(cachedUrl)
            urlCache.delete(action.file)
          }
        }

        files.delete(action.file)

        if (onValueChange) {
          const fileList = Array.from(files.values()).map(
            (fileState) => fileState.file,
          )
          onValueChange(fileList)
        }
        return { ...state, files }
      }

      case "SET_DRAG_OVER": {
        return { ...state, dragOver: action.dragOver }
      }

      case "SET_INVALID": {
        return { ...state, invalid: action.invalid }
      }

      case "CLEAR": {
        if (urlCache) {
          for (const file of Array.from(files.keys())) {
            const cachedUrl = urlCache.get(file)
            if (cachedUrl) {
              URL.revokeObjectURL(cachedUrl)
              urlCache.delete(file)
            }
          }
        }

        files.clear()
        if (onValueChange) {
          onValueChange([])
        }
        return { ...state, files, invalid: false }
      }

      default:
        return state
    }
  }

  function getState() {
    return state
  }

  function dispatch(action: StoreAction) {
    state = reducer(state, action)
    for (const listener of Array.from(listeners)) {
      listener()
    }
  }

  function subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  return { getState, dispatch, subscribe }
}

/**
 * lazy reference를 위한 유틸리티 훅
 * 초기화 함수가 한 번만 실행되도록 보장
 */
export function useLazyRef<T>(fn: () => T) {
  const ref = React.useRef<T | null>(null)

  if (ref.current === null) {
    ref.current = fn()
  }

  return ref as React.MutableRefObject<T>
}

/**
 * 스토어 컨텍스트
 */
export const StoreContext = React.createContext<FileUploadStore | null>(null)

/**
 * 스토어 컨텍스트를 사용하는 훅
 */
export function useStoreContext(consumerName: string) {
  const context = React.useContext(StoreContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within FileUpload`)
  }
  return context
}

/**
 * 선택적 상태 구독을 위한 훅
 * 성능 최적화를 위해 필요한 상태만 구독
 */
export function useStore<T>(selector: (state: StoreState) => T): T {
  const store = useStoreContext("FileUpload")

  const lastValueRef = useLazyRef<{ value: T; state: StoreState } | null>(
    () => null,
  )

  const getSnapshot = React.useCallback(() => {
    const state = store.getState()
    const prevValue = lastValueRef.current

    if (prevValue && prevValue.state === state) {
      return prevValue.value
    }

    const nextValue = selector(state)
    lastValueRef.current = { value: nextValue, state }
    return nextValue
  }, [store, selector, lastValueRef])

  return React.useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot)
}
