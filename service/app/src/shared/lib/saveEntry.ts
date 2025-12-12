export const saveEntry = () => {
  if (typeof window === "undefined") return
  const { pathname, search } = window.location
  sessionStorage.setItem("entry", `${pathname}${search}`)
}

export const getEntry = () => {
  if (typeof window === "undefined") return
  return sessionStorage.getItem("entry")
}
