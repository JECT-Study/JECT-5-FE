import { Suspense } from "react"

import { useIsMounted } from "./lib/useIsMounted"

const SSRSafeSuspense = (props: React.ComponentProps<typeof Suspense>) => {
  const { fallback } = props
  const isMounted = useIsMounted()

  if (isMounted) {
    return <Suspense {...props} />
  }
  return <>{fallback}</>
}

export default SSRSafeSuspense
