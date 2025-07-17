import { forwardRef, type Ref, type SVGProps } from "react"
const Add = (
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
      d="M12.002 3.6a1.2 1.2 0 0 1 1.2 1.2v6h6a1.2 1.2 0 0 1 0 2.4h-6v6a1.2 1.2 0 0 1-2.4 0v-6h-6a1.2 1.2 0 0 1 0-2.4h6v-6a1.2 1.2 0 0 1 1.2-1.2"
      clipRule="evenodd"
    />
  </svg>
)
const ForwardRef = forwardRef(Add)
export default ForwardRef
