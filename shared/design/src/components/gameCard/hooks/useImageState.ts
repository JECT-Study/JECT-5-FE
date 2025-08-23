import { useCallback, useState } from "react"

export const useImageState = () => {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const handleLoad = useCallback(() => {
    setImageLoading(false)
  }, [])

  const handleError = useCallback(() => {
    setImageLoading(false)
    setImageError(true)
  }, [])

  return {
    imageLoading,
    imageError,
    handleLoad,
    handleError,
  }
}
