"use client"

import { Toaster } from "sonner"

export const Toast = () => {
  return (
    <Toaster
      position="bottom-left"
      toastOptions={{
        classNames: {
          toast:
            "!rounded-8 !p-20 !min-h-60 !bg-background-thumbnail-primary !text-primary !typography-text-primary",
        },
      }}
    />
  )
}
