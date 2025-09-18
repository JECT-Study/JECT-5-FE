import { useCallback, useRef } from "react"

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  onIntersect: () => void
  disabled?: boolean
}

export const useIntersectionObserver = ({
  onIntersect,
  disabled = false,
  root = null,
  rootMargin = "100px",
  threshold = 0.1,
  ...options
}: UseIntersectionObserverOptions) => {
  const observerRef = useRef<HTMLDivElement | null>(null)
  const observer = useRef<IntersectionObserver | null>(null)

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry?.isIntersecting && !disabled) {
        onIntersect()
      }
    },
    [onIntersect, disabled],
  )

  const setObserverRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) {
        observer.current.disconnect()
      }

      observerRef.current = node

      if (node && !disabled) {
        observer.current = new IntersectionObserver(observerCallback, {
          root,
          rootMargin,
          threshold,
          ...options,
        })
        observer.current.observe(node)
      }
    },
    [observerCallback, disabled, root, rootMargin, threshold, options],
  )

  return setObserverRef
}
