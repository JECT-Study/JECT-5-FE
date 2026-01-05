import { forwardRef, type Ref, type SVGProps } from "react"
const SunFilled = (
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
    <path d="M12 2.4a1.2 1.2 0 0 1 1.2 1.2v1.2a1.2 1.2 0 0 1-2.4 0V3.6A1.2 1.2 0 0 1 12 2.4M16.8 12a4.8 4.8 0 1 1-9.6 0 4.8 4.8 0 0 1 9.6 0M16.243 17.94l.849.848a1.2 1.2 0 0 0 1.697-1.697l-.849-.849a1.2 1.2 0 0 0-1.697 1.697M18.789 5.212a1.2 1.2 0 0 1 0 1.697l-.849.848a1.2 1.2 0 1 1-1.697-1.697l.849-.848a1.2 1.2 0 0 1 1.697 0M20.4 13.2a1.2 1.2 0 0 0 0-2.4h-1.2a1.2 1.2 0 1 0 0 2.4zM12 18a1.2 1.2 0 0 1 1.2 1.2v1.2a1.2 1.2 0 0 1-2.4 0v-1.2A1.2 1.2 0 0 1 12 18M6.06 7.757A1.2 1.2 0 0 0 7.759 6.06l-.849-.848a1.2 1.2 0 0 0-1.697 1.697zM7.758 17.94l-.849.848a1.2 1.2 0 0 1-1.697-1.697l.849-.849a1.2 1.2 0 1 1 1.697 1.697M4.8 13.2a1.2 1.2 0 0 0 0-2.4H3.6a1.2 1.2 0 0 0 0 2.4z" />
  </svg>
)
const ForwardRef = forwardRef(SunFilled)
export default ForwardRef
