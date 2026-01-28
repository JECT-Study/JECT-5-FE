import { useCallback, useState } from "react"

interface UseEmailSelectionReturn {
  selectedEmails: Set<string>
  handleSelectChange: (email: string, checked: boolean) => void
  handleSelectAll: (emails: string[], checked: boolean) => void
  clearSelection: () => void
}

export const useEmailSelection = (): UseEmailSelectionReturn => {
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set())

  const handleSelectChange = useCallback((email: string, checked: boolean) => {
    setSelectedEmails((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(email)
      } else {
        next.delete(email)
      }
      return next
    })
  }, [])

  const handleSelectAll = useCallback((emails: string[], checked: boolean) => {
    if (checked) {
      setSelectedEmails(new Set(emails))
    } else {
      setSelectedEmails(new Set())
    }
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedEmails(new Set())
  }, [])

  return {
    selectedEmails,
    handleSelectChange,
    handleSelectAll,
    clearSelection,
  }
}
