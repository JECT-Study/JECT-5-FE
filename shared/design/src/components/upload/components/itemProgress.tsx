"use client"

import { Slot } from "radix-ui"

import { ITEM_PROGRESS_NAME, useFileUploadItemContext } from "../hooks"
import type { FileUploadItemProgressProps } from "../types"

export function FileUploadItemProgress(props: FileUploadItemProgressProps) {
  const {
    variant = "linear",
    size = 40,
    asChild,
    forceMount,
    className,
    ...progressProps
  } = props

  const itemContext = useFileUploadItemContext(ITEM_PROGRESS_NAME)

  if (!itemContext.fileState) return null

  const shouldRender = forceMount || itemContext.fileState.progress !== 100

  if (!shouldRender) return null

  const ItemProgressPrimitive = asChild ? Slot.Root : "div"

  switch (variant) {
    case "circular": {
      const circumference = 2 * Math.PI * ((size - 4) / 2)
      const strokeDashoffset =
        circumference - (itemContext.fileState.progress / 100) * circumference

      return (
        <ItemProgressPrimitive
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={itemContext.fileState.progress}
          aria-valuetext={`${itemContext.fileState.progress}%`}
          aria-labelledby={itemContext.nameId}
          data-slot="file-upload-progress"
          {...progressProps}
          className={className}
        >
          <svg
            className="-rotate-90"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            fill="none"
            stroke="currentColor"
          >
            <circle
              strokeWidth="2"
              cx={size / 2}
              cy={size / 2}
              r={(size - 4) / 2}
            />
            <circle
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              cx={size / 2}
              cy={size / 2}
              r={(size - 4) / 2}
            />
          </svg>
        </ItemProgressPrimitive>
      )
    }
    case "fill": {
      const progressPercentage = itemContext.fileState.progress
      const topInset = 100 - progressPercentage

      return (
        <ItemProgressPrimitive
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercentage}
          aria-valuetext={`${progressPercentage}%`}
          aria-labelledby={itemContext.nameId}
          data-slot="file-upload-progress"
          {...progressProps}
          className={className}
          style={{
            clipPath: `inset(${topInset}% 0% 0% 0%)`,
            ...progressProps.style,
          }}
        />
      )
    }
    default:
      return (
        <ItemProgressPrimitive
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={itemContext.fileState.progress}
          aria-valuetext={`${itemContext.fileState.progress}%`}
          aria-labelledby={itemContext.nameId}
          data-slot="file-upload-progress"
          {...progressProps}
          className={className}
        >
          <div
            style={{
              transform: `translateX(-${100 - itemContext.fileState.progress}%)`,
              ...progressProps.style,
            }}
          />
        </ItemProgressPrimitive>
      )
  }
}
