import { forwardRef, type Ref, type SVGProps } from "react"
const More_dot = (
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
    fill="none"
    viewBox="0 0 24 24"
    ref={ref}
    {...props}
  >
    <g fill="#000">
      <path d="M12.002 7.2a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8M12.002 14.4a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8M12.002 21.6a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8" />
    </g>
  </svg>
)
const ForwardRef = forwardRef(More_dot)
export default ForwardRef
