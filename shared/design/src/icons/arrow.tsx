import { forwardRef, type Ref, type SVGProps } from "react"
const Arrow = (
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
    <path
      fill="#000"
      fillRule="evenodd"
      d="M19.707 15.707a1 1 0 0 1-1.414 0L12 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414l7-7a1 1 0 0 1 1.414 0l7 7a1 1 0 0 1 0 1.414"
      clipRule="evenodd"
    />
  </svg>
)
const ForwardRef = forwardRef(Arrow)
export default ForwardRef
