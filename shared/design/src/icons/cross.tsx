import { forwardRef, type Ref, type SVGProps } from "react"
const Cross = (
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
      d="M5.152 5.152a1.2 1.2 0 0 1 1.697 0l5.152 5.151 5.151-5.151a1.2 1.2 0 1 1 1.697 1.697L13.698 12l5.151 5.151a1.2 1.2 0 0 1-1.697 1.698l-5.151-5.152-5.152 5.152a1.2 1.2 0 0 1-1.697-1.698L10.304 12 5.152 6.849a1.2 1.2 0 0 1 0-1.697"
      clipRule="evenodd"
    />
  </svg>
)
const ForwardRef = forwardRef(Cross)
export default ForwardRef
