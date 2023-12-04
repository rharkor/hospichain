import { createContext } from "react"

export type IWeb3Role =
  | {
      roles: string[]
      isLoaded: boolean
    }
  | undefined

export const Web3RoleContext = createContext<IWeb3Role>(undefined)
