import { forwardRef, type Ref, type SVGProps } from "react"
const Copy = (
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
    <path d="M10.8 2.4a2.4 2.4 0 0 0-2.4 2.4v9.6a2.4 2.4 0 0 0 2.4 2.4H18a2.4 2.4 0 0 0 2.4-2.4V7.697A2.4 2.4 0 0 0 19.697 6L16.8 3.103a2.4 2.4 0 0 0-1.697-.703z" />
    <path d="M3.6 9.6A2.4 2.4 0 0 1 6 7.2v12h9.6a2.4 2.4 0 0 1-2.4 2.4H6a2.4 2.4 0 0 1-2.4-2.4z" />
  </svg>
)
const ForwardRef = forwardRef(Copy)
export default ForwardRef
