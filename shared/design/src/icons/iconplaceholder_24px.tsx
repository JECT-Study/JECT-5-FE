import { forwardRef, type Ref, type SVGProps } from "react"
const Iconplaceholder_24px = (
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
    <path d="m4 18 .01.204A2 2 0 0 0 6 20h3.818v2H6l-.206-.005a4 4 0 0 1-3.79-3.789L2 18v-3.818h2zM22 18a4 4 0 0 1-3.794 3.995L18 22h-3.818v-2H18a2 2 0 0 0 2-2v-3.818h2zM9.818 4H6a2 2 0 0 0-2 2v3.818H2V6a4 4 0 0 1 4-4h3.818zM18 2a4 4 0 0 1 4 4v3.818h-2V6a2 2 0 0 0-1.796-1.99L18 4h-3.818V2z" />
  </svg>
)
const ForwardRef = forwardRef(Iconplaceholder_24px)
export default ForwardRef
