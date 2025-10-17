import { forwardRef, type Ref, type SVGProps } from "react"

const ArrowRight = (
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
      d="M3 16C1.61929 16 0.5 17.1193 0.5 18.5C0.5 19.8807 1.61929 21 3 21V18.5V16ZM44.7678 20.2678C45.7441 19.2915 45.7441 17.7085 44.7678 16.7322L28.8579 0.82233C27.8816 -0.15398 26.2986 -0.15398 25.3223 0.82233C24.346 1.79864 24.346 3.38155 25.3223 4.35786L39.4645 18.5L25.3223 32.6421C24.346 33.6184 24.346 35.2014 25.3223 36.1777C26.2986 37.154 27.8816 37.154 28.8579 36.1777L44.7678 20.2678ZM3 18.5V21H43V18.5V16H3V18.5Z"
      fill="#51A2FF"
    />
  </svg>
)

const ForwardRef = forwardRef(ArrowRight)
export default ForwardRef
