import { useAccount, useContractRead } from "wagmi"
import roleAbi from "blockchain/abi/contracts/role-manager.sol/RoleManager.json"
import { env } from "env.mjs"
import { Web3RoleContext } from "./context"

export default function Web3RoleProvider({ children }: { children: React.ReactNode }) {
  const { address } = useAccount()
  const { data, isFetched } = useContractRead({
    address: env.NEXT_PUBLIC_ROLE_MANAGER as `0x${string}`,
    abi: roleAbi,
    functionName: "getRoles",
    args: [address],
  })

  return (
    <Web3RoleContext.Provider
      value={{
        roles: (data as string[] | undefined)?.filter((e) => !!e) ?? [],
        isLoaded: isFetched,
      }}
    >
      {children}
    </Web3RoleContext.Provider>
  )
}
