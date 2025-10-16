import { forwardRef, type Ref, type SVGProps } from "react"
const Share = (
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
    <path d="M18 9.6a3.6 3.6 0 1 0-3.572-3.155L8.499 9.409a3.6 3.6 0 1 0 0 5.182l5.929 2.964a3.6 3.6 0 1 0 1.074-2.146l-5.929-2.964a3.6 3.6 0 0 0 0-.89l5.928-2.964a3.6 3.6 0 0 0 2.5 1.009" />
  </svg>
)
const ForwardRef = forwardRef(Share)
export default ForwardRef
