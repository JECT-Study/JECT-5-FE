import { forwardRef, type Ref, type SVGProps } from "react"
const Trash = (
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
      d="M10.802 2.4a1.2 1.2 0 0 0-1.074.663L8.86 4.8H4.802a1.2 1.2 0 0 0 0 2.4v12a2.4 2.4 0 0 0 2.4 2.4h9.6a2.4 2.4 0 0 0 2.4-2.4v-12a1.2 1.2 0 0 0 0-2.4h-4.059l-.868-1.737a1.2 1.2 0 0 0-1.073-.663zm-2.4 7.2a1.2 1.2 0 0 1 2.4 0v7.2a1.2 1.2 0 0 1-2.4 0zm6-1.2a1.2 1.2 0 0 0-1.2 1.2v7.2a1.2 1.2 0 1 0 2.4 0V9.6a1.2 1.2 0 0 0-1.2-1.2"
      clipRule="evenodd"
    />
  </svg>
)
const ForwardRef = forwardRef(Trash)
export default ForwardRef
