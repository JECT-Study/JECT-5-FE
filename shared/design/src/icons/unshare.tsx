import { forwardRef, type Ref, type SVGProps } from "react"
const Unshare = (
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
    <path d="M2.033 2.68a1.2 1.2 0 0 1 1.696-.06l3.8 3.542L10.692 3a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L12.4 6.12v4.586l6 5.596v-.596a1 1 0 0 1 2 0v1c0 .443-.073.87-.207 1.268l1.715 1.6a1.2 1.2 0 1 1-1.637 1.754L2.093 4.376a1.2 1.2 0 0 1-.06-1.696M3.4 14.706a1 1 0 0 1 1 1v1a2 2 0 0 0 2 2h8.658l2.072 1.932q-.355.066-.73.068h-10a4 4 0 0 1-4-4v-1a1 1 0 0 1 1-1m8.902 1.43a.999.999 0 0 1-1.902-.43v-1.344zm-3.31-8.609L10.4 8.841V6.12z" />
  </svg>
)
const ForwardRef = forwardRef(Unshare)
export default ForwardRef
