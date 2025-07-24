import { forwardRef, type Ref, type SVGProps } from "react"
const Minus = (
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
    <path
      fillRule="evenodd"
      d="M3.6 12a1.2 1.2 0 0 1 1.2-1.2h14.4a1.2 1.2 0 0 1 0 2.4H4.8A1.2 1.2 0 0 1 3.6 12"
      clipRule="evenodd"
    />
  </svg>
)
const ForwardRef = forwardRef(Minus)
export default ForwardRef
