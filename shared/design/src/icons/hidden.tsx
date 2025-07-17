import { forwardRef, type Ref, type SVGProps } from "react"
const Hidden = (
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
      d="M4.448 2.751A1.2 1.2 0 0 0 2.75 4.448l16.8 16.8a1.2 1.2 0 1 0 1.697-1.697l-1.768-1.767A12 12 0 0 0 23.45 12C21.921 7.13 17.373 3.6 12 3.6a11.95 11.95 0 0 0-5.415 1.288zM9.56 7.865l1.817 1.816a2.403 2.403 0 0 1 2.94 2.94l1.817 1.817A4.8 4.8 0 0 0 9.56 7.865"
      clipRule="evenodd"
    />
    <path d="M14.944 20.036 11.7 16.79a4.8 4.8 0 0 1-4.49-4.49L2.8 7.893A12 12 0 0 0 .55 12c1.529 4.869 6.077 8.4 11.45 8.4 1.016 0 2.003-.126 2.945-.364" />
  </svg>
)
const ForwardRef = forwardRef(Hidden)
export default ForwardRef
