import { forwardRef, type Ref, type SVGProps } from "react"

const ArrowLeft = (
  {
    size = 24,
    ...props
  }: SVGProps<SVGSVGElement> & {
    size?: number | string
  },
  ref: Ref<SVGSVGElement>,
) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 46 37"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path
      d="M43 21.0098C44.3807 21.0098 45.5 19.8905 45.5 18.5098C45.5 17.1291 44.3807 16.0098 43 16.0098L43 18.5098L43 21.0098ZM1.23223 16.742C0.255924 17.7183 0.255924 19.3012 1.23223 20.2775L17.1421 36.1874C18.1184 37.1637 19.7014 37.1637 20.6777 36.1874C21.654 35.2111 21.654 33.6282 20.6777 32.6519L6.53553 18.5098L20.6777 4.36763C21.654 3.39132 21.654 1.8084 20.6777 0.832094C19.7014 -0.144217 18.1184 -0.144217 17.1421 0.832094L1.23223 16.742ZM43 18.5098L43 16.0098L3 16.0098L3 18.5098L3 21.0098L43 21.0098L43 18.5098Z"
      fill="#51A2FF"
    />
  </svg>
)

const ForwardRef = forwardRef(ArrowLeft)
export default ForwardRef
