import { forwardRef, type Ref, type SVGProps } from "react"
const Edit = (
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
    <path d="M16.305 4.303a2.4 2.4 0 1 1 3.394 3.394l-.952.952-3.394-3.394zM13.656 6.952 3.602 17.006V20.4h3.394L17.05 10.346z" />
  </svg>
)
const ForwardRef = forwardRef(Edit)
export default ForwardRef
