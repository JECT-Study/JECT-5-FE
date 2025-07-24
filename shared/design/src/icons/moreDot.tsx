import { forwardRef, type Ref, type SVGProps } from "react"
const MoreDot = (
  {
    size = 24,
    ...props
  }: SVGProps<SVGSVGElement> & {
    size?: number | string
  },
  ref: Ref<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    ref={ref}
    {...props}
  >
    <path d="M12.002 7.2a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8M12.002 14.4a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8M12.002 21.6a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8" />
  </svg>
)
const ForwardRef = forwardRef(MoreDot)
export default ForwardRef
