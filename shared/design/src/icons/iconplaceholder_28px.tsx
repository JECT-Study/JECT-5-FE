import { forwardRef, type Ref, type SVGProps } from "react"
const Iconplaceholder_28px = (
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
    viewBox="0 0 28 28"
    fill="currentColor"
    ref={ref}
    {...props}
  >
    <path d="m4.665 21 .013.238a2.333 2.333 0 0 0 2.32 2.095h4.456v2.334H6.999l-.24-.006a4.67 4.67 0 0 1-4.421-4.42L2.332 21v-4.455h2.333zM25.665 21a4.667 4.667 0 0 1-4.426 4.66l-.24.007h-4.455v-2.334h4.455A2.333 2.333 0 0 0 23.332 21v-4.455h2.333zM11.454 4.667H6.999A2.333 2.333 0 0 0 4.665 7v4.455H2.332V7a4.667 4.667 0 0 1 4.667-4.667h4.455zM20.999 2.333A4.667 4.667 0 0 1 25.665 7v4.455h-2.333V7a2.333 2.333 0 0 0-2.095-2.32l-.238-.013h-4.455V2.333z" />
  </svg>
)
const ForwardRef = forwardRef(Iconplaceholder_28px)
export default ForwardRef
