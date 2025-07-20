import { forwardRef, type Ref, type SVGProps } from "react"
const Iconplaceholder_16px = (
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
    viewBox="0 0 16 16"
    fill="currentColor"
    ref={ref}
    {...props}
  >
    <path d="m2.665 12 .008.136a1.333 1.333 0 0 0 1.326 1.197h2.545v1.334H4l-.138-.004a2.667 2.667 0 0 1-2.526-2.526L1.332 12V9.454h1.333zM14.665 12a2.667 2.667 0 0 1-2.529 2.663l-.137.004H9.453v-1.334H12c.736 0 1.333-.597 1.333-1.333V9.454h1.333zM6.544 2.667H4c-.737 0-1.334.597-1.334 1.333v2.545H1.332V4a2.667 2.667 0 0 1 2.667-2.667h2.545zM11.999 1.333A2.667 2.667 0 0 1 14.665 4v2.545h-1.333V4c0-.69-.525-1.258-1.197-1.326l-.136-.007H9.453V1.333z" />
  </svg>
)
const ForwardRef = forwardRef(Iconplaceholder_16px)
export default ForwardRef
