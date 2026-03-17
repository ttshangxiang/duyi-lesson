import { MyContext, useUser } from "@/tools/utils"
import { useContext } from "react"

const person = () => {
  const { click, state, dispatch } = useUser()

  return (
    <>
      <button onClick={click}>Person</button>
      <button onClick={() => dispatch({ type: "LOGOUT" })}>登出</button>
    </>
  )
}

export default person
