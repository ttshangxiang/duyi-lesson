import { useCallback, useEffect, useRef, useState } from "react"

export const useThrottle = (value: any, wait: number = 500) => {
  const [throttleValue, setThrottleValue] = useState(value)
  const lastTime = useRef(0)
  let timer = useRef<any>(null)

  useEffect(() => {
    const now = Date.now()
    if (now - lastTime.current > wait) {
      lastTime.current = now
      setThrottleValue(value)
    } else {
      if (timer.current) return
      timer.current = setTimeout(
        () => {
          lastTime.current = Date.now()
          timer.current = null
          setThrottleValue(value)
        },
        wait - (now - lastTime.current),
      )
    }
  }, [value, wait])

  return throttleValue
}

export const useThrottleFn = (func: any, wait: number = 500) => {
  const fnRef = useRef(func)
  const lastTime = useRef(0)

  useEffect(() => {
    fnRef.current = func
  }, [func])

  const callback = useCallback(
    (...args: any[]) => {
      const now = Date.now()
      if (now - lastTime.current > wait) {
        lastTime.current = now
        fnRef.current(...args)
      }
    },
    [wait],
  )

  return { run: callback }
}
