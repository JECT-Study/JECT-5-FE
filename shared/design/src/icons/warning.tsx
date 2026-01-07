import { forwardRef, type Ref, type SVGProps } from "react"
const Warning = (
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
      d="M9.908 3.718c.918-1.63 3.267-1.63 4.184 0l6.696 11.905c.9 1.6-.256 3.577-2.091 3.577H5.304c-1.836 0-2.992-1.977-2.092-3.577zM13.2 15.6a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0M12 6a1.2 1.2 0 0 0-1.2 1.2v3.6a1.2 1.2 0 0 0 2.4 0V7.2A1.2 1.2 0 0 0 12 6"
      clipRule="evenodd"
    />
  </svg>
)
const ForwardRef = forwardRef(Warning)
export default ForwardRef
