import { forwardRef, type Ref, type SVGProps } from "react"
const Show = (
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
    <path d="M12 14.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8" />
    <path
      fillRule="evenodd"
      d="M.549 12c1.529-4.868 6.077-8.4 11.45-8.4 5.374 0 9.922 3.532 11.451 8.4-1.529 4.869-6.077 8.4-11.45 8.4C6.626 20.4 2.077 16.87.548 12m16.25 0a4.8 4.8 0 1 1-9.6 0 4.8 4.8 0 0 1 9.6 0"
      clipRule="evenodd"
    />
  </svg>
)
const ForwardRef = forwardRef(Show)
export default ForwardRef
