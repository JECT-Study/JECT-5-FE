import { type ComponentPropsWithoutRef, type CSSProperties } from "react"

import { cn } from "../../utils/cn"

type StickyActionBarPosition = "static" | "sticky" | "fixed"
type StickyActionBarEdge = "top" | "bottom"
type StickyActionBarAlign = "start" | "center" | "end" | "space-between"

export interface StickyActionBarProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * 원하는 포지셔닝 방식을 선택합니다. 기본값은 `sticky`입니다.
   */
  position?: StickyActionBarPosition
  /**
   * 고정될 방향을 결정합니다. 기본값은 `bottom`입니다.
   */
  edge?: StickyActionBarEdge
  /**
   * `sticky` 또는 `fixed` 상태일 때의 오프셋 값입니다. 숫자는 px 단위로 처리됩니다.
   */
  offset?: number | string
  /**
   * 내부 콘텐츠 정렬 방식입니다. 기본값은 `center`입니다.
   */
  align?: StickyActionBarAlign
  /**
   * 내부 컨텐츠 영역에 추가 클래스를 지정합니다.
   */
  contentClassName?: string
  /**
   * 내부 컨텐츠 영역의 최대 너비를 제한합니다.
   */
  maxWidth?: number | string
  /**
   * 컨테이너의 라운드를 적용할지 여부입니다.
   */
  rounded?: boolean
}

const justifyClassMap: Record<StickyActionBarAlign, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  "space-between": "justify-between",
}

export const StickyActionBar = ({
  children,
  className,
  style,
  position = "sticky",
  edge = "bottom",
  offset = 0,
  align = "center",
  contentClassName,
  maxWidth,
  rounded = false,
  ...rest
}: StickyActionBarProps) => {
  const offsetValue =
    position === "static"
      ? undefined
      : typeof offset === "number"
        ? `${offset}px`
        : offset

  const positionalClass =
    position === "fixed"
      ? "fixed inset-x-0"
      : position === "sticky"
        ? "sticky"
        : undefined

  const radiusClass = rounded ? "rounded-12" : undefined

  const shadowClass = "bg-none bg-transparent"

  const positionalStyle: CSSProperties =
    position === "static" || !offsetValue
      ? {}
      : edge === "bottom"
        ? { bottom: offsetValue }
        : { top: offsetValue }

  const innerStyle: CSSProperties | undefined =
    maxWidth !== undefined
      ? {
          maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
        }
      : undefined

  return (
    <div
      className={cn(
        "z-40 flex w-full justify-center px-24 py-12",
        positionalClass,
        shadowClass,
        radiusClass,
        className,
      )}
      style={{ ...positionalStyle, ...style }}
      {...rest}
    >
      <div
        className={cn(
          "flex w-full items-center gap-16",
          justifyClassMap[align],
          contentClassName,
        )}
        style={innerStyle}
      >
        {children}
      </div>
    </div>
  )
}

StickyActionBar.displayName = "StickyActionBar"
