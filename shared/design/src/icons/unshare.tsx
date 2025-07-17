import { forwardRef, type Ref, type SVGProps } from "react"
const Unshare = (
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
    <path d="M2.35 2.352a1.2 1.2 0 0 1 1.697-.002l3.652 3.642 2.995-2.993a1 1 0 0 1 1.414 0l4 4a1 1 0 1 1-1.414 1.414L12.401 6.12v4.558l6 5.98v-.952a1 1 0 0 1 2 0v1c0 .572-.123 1.116-.34 1.608l1.59 1.585a1.2 1.2 0 1 1-1.694 1.7L2.352 4.048a1.2 1.2 0 0 1-.002-1.697m1.051 12.354a1 1 0 0 1 1 1v1a2 2 0 0 0 2 2h9.358l1.826 1.821a4 4 0 0 1-1.184.179h-10a4 4 0 0 1-4-4v-1a1 1 0 0 1 1-1m9 .653v.347a1 1 0 0 1-2 0v-2.341zM9.116 7.403l1.285 1.281V6.12z" />
  </svg>
)
const ForwardRef = forwardRef(Unshare)
export default ForwardRef
