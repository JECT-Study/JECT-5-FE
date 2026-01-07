import { forwardRef, type Ref, type SVGProps } from "react"
const Check = (
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
    <path d="m11.074 17.456-.024.024L5 11.43l1.97-1.97 4.104 4.104L17.638 7l1.97 1.97-8.51 8.51z" />
  </svg>
)
const ForwardRef = forwardRef(Check)
export default ForwardRef
