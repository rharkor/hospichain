import { useContext } from "react"
import { Web3RoleContext } from "./context"

export const useWeb3Role = () => {
  const context = useContext(Web3RoleContext)
  if (context === undefined) {
    throw new Error("useWeb3Role must be used within a Web3RoleProvider")
  }
  return context
}
