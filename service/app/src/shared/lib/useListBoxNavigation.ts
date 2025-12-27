import { RefObject } from "react"

interface UseListboxNavigationParams {
  listboxRef: RefObject<HTMLElement>
}

export function useListboxNavigation({
  listboxRef,
}: UseListboxNavigationParams) {
  const onListboxFocus = (e: React.FocusEvent) => {
    if (e.target !== e.currentTarget) return

    const selectedOption =
      listboxRef.current?.querySelector<HTMLElement>(
        '[role="option"][aria-selected="true"]',
      ) ?? listboxRef.current?.querySelector<HTMLElement>('[role="option"]')

    selectedOption?.focus()
  }

  const onOptionKeyDown = (
    e: React.KeyboardEvent<HTMLElement>,
    onSelect?: () => void,
  ) => {
    const isFromChild = e.currentTarget !== e.target
    if (isFromChild && e.key !== "Escape") return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        ;(e.currentTarget.nextElementSibling as HTMLElement | null)?.focus()
        break

      case "ArrowUp":
        e.preventDefault()
        ;(e.currentTarget.previousElementSibling as HTMLElement | null)?.focus()
        break

      case "Enter":
      case " ":
        e.preventDefault()
        onSelect?.()
        break

      case "Escape":
        e.stopPropagation()
        ;(e.currentTarget as HTMLElement).focus()
        break
    }
  }

  return {
    onListboxFocus,
    onOptionKeyDown,
  }
}
