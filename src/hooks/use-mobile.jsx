import * as React from "react"

/**
 * The breakpoint in pixels below which the screen is considered "mobile".
 * 768px is a common threshold, aligning with typical tablet/mobile device widths.
 */
const MOBILE_BREAKPOINT = 768

/**
 * Custom React Hook to determine if the current device/viewport is "mobile".
 *
 * It subscribes to browser window resize events and maintains a state
 * (`isMobile`) which is true if `window.innerWidth` is less than
 * `MOBILE_BREAKPOINT`, and false otherwise. It initializes to `undefined`
 * to prevent a flash of content in the wrong state before the client-side
 * JavaScript mounts and calculates the correct value.
 *
 * @returns {boolean} `true` if the screen width is less than the breakpoint, `false` otherwise.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange);
  }, [])

  return !!isMobile
}
