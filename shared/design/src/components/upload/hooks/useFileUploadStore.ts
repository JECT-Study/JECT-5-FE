import * as React from "react"

import type { FileState, StoreAction, StoreState } from "../types"
import { useLazyRef } from "../utils"

const ROOT_NAME = "FileUpload"

function createStore(
  listeners: Set<() => void>,
  files: Map<File, FileState>,
  urlCache: WeakMap<File, string>,
  invalid: boolean,
  onValueChange?: (files: File[]) => void,
) {
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

const StoreContext = React.createContext<ReturnType<typeof createStore> | null>(
  null,
)

export function useStoreContext(consumerName: string) {
  const context = React.useContext(StoreContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\``)
  }
  return context
}

export function useStore<T>(selector: (state: StoreState) => T): T {
  const store = useStoreContext(ROOT_NAME)

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

export { createStore, StoreContext }
