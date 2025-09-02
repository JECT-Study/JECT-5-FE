"use client"

import { Slot } from "radix-ui"

import { useStore } from "../core/store"
import { COMPONENT_NAMES, type FileUploadListProps } from "../types"
import { useFileUploadContext } from "../upload"

const { LIST: LIST_NAME } = COMPONENT_NAMES

/**
 * 파일 목록 컴포넌트
 *
 * 업로드된 파일들의 목록을 표시하는 컨테이너 컴포넌트
 */
export function FileUploadList(props: FileUploadListProps) {
  const {
    className,
    orientation = "vertical",
    asChild,
    forceMount,
    ...listProps
  } = props

  const context = useFileUploadContext(LIST_NAME)
  const fileCount = useStore((state) => state.files.size)
  const shouldRender = forceMount || fileCount > 0

  if (!shouldRender) return null

  const ListPrimitive = asChild ? Slot.Root : "div"

  return (
    <ListPrimitive
      role="list"
      id={context.listId}
      aria-orientation={orientation}
      data-orientation={orientation}
      data-slot="file-upload-list"
      data-state={shouldRender ? "active" : "inactive"}
      dir={context.dir}
      {...listProps}
      className={className}
    />
  )
}
