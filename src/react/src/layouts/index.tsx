import Person from "@/components/person"
import { useDebounce, useDebounceFn } from "@/hooks/useDebounce"
import { useThrottleFn } from "@/hooks/useThrottle"
import { initialState, MyContext, userReducer } from "@/tools/utils"
import { useReducer, useState } from "react"

export default function Layout() {
  const [state, dispatch] = useReducer(userReducer, initialState)

  const { run: debounceRun } = useDebounceFn(() => {
    console.log("%c Line:6 🥤", "background:#93c0a4")
  })

  const [value, setValue] = useState<number>(1)
  const debounceValue = useDebounce(value)

  const { run: throttleRun } = useThrottleFn(() => {
    console.log("%c Line:12 🍷", "background:#ea7e5c")
  }, 1000)

  const handleClick = () => {
    console.log("%c Line:22 🍯", "background:#2eafb0", 123)
  }

  return (
    <MyContext.Provider
      value={{
        click: handleClick,
        state,
        dispatch,
      }}
    >
      <button onClick={debounceRun}>button_1</button>
      <button onClick={throttleRun}>button_2</button>
      <button onClick={() => setValue((pre: number) => pre + 1)}>
        button_{debounceValue}
      </button>
      <Person />
    </MyContext.Provider>
  )
}
