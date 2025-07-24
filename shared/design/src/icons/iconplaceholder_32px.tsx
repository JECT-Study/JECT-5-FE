import { forwardRef, type Ref, type SVGProps } from "react"
const Iconplaceholder_32px = (
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
    viewBox="0 0 32 32"
    fill="currentColor"
    ref={ref}
    {...props}
  >
    <path d="m5.335 24 .014.272a2.666 2.666 0 0 0 2.652 2.395h5.091v2.666h-5.09l-.275-.006a5.335 5.335 0 0 1-5.053-5.052L2.668 24V18.91h2.667zM29.335 24a5.334 5.334 0 0 1-5.059 5.327l-.275.006h-5.09v-2.666H24A2.667 2.667 0 0 0 26.668 24V18.91h2.667zM13.092 5.333h-5.09A2.667 2.667 0 0 0 5.334 8v5.091H2.668v-5.09a5.333 5.333 0 0 1 5.333-5.334h5.091zM24.001 2.667A5.333 5.333 0 0 1 29.335 8v5.091h-2.667v-5.09c0-1.382-1.05-2.517-2.395-2.653l-.272-.015h-5.09V2.667z" />
  </svg>
)
const ForwardRef = forwardRef(Iconplaceholder_32px)
export default ForwardRef
