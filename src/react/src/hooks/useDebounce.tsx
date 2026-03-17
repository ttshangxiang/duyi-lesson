import { useEffect, useRef, useState } from "react"

export const useDebounceFn = (func: any, wait: number = 500) => {
  const timerRef = useRef<any>(null)

  const callback = (...args: any[]) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    timerRef.current = setTimeout(() => {
      clearTimeout(timerRef.current)
      timerRef.current = null
      func(...args)
    }, wait)
  }

  return { run: callback }
}

export const useDebounce = (value: any, wait = 500) => {
  const [state, setState] = useState<any>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setState(value)
    }, wait)
    return () => {
      clearTimeout(timer)
    }
  }, [value, wait])

  return state
}
