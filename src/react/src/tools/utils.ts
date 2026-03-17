import { createContext, useContext } from "react"

export const MyContext = createContext({} as any)

// 2. 初始状态
export const initialState = {
  name: "",
  age: "",
  token: "",
  isLogin: false,
}

// 3. reducer 函数（处理状态修改）
export function userReducer(state: any, action: any) {
  console.log("%c Line:15 🌰 action", "background:#ffdd4d", action)
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        ...action.payload, // 传入用户信息
        isLogin: true,
      }
    case "LOGOUT":
      return initialState // 重置
    default:
      return state
  }
}

export function useUser() {
  return useContext(MyContext)
}
