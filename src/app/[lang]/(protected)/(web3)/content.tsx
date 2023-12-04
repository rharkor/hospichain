"use client"

import { Button } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { useAccount, useContractRead } from "wagmi"
import { useWeb3Role } from "@/contexts/web3role/utils"
import roleAbi from "blockchain/abi/contracts/role-manager.sol/RoleManager.json"
import { env } from "env.mjs"

export default function HomeContent() {
  const { roles, isLoaded } = useWeb3Role()
  const { address } = useAccount()
  const [isMounted, setIsMounted] = useState(false)
  const { data: addressInfos, isFetched: isAddressInfoFetched } = useContractRead({
    address: env.NEXT_PUBLIC_ROLE_MANAGER as `0x${string}`,
    abi: roleAbi,
    functionName: "addressInfos",
    args: [address],
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const myInfo = addressInfos && (addressInfos as string[])[0]

  return (
    <div className="container m-auto flex flex-col gap-4 py-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{isMounted && isAddressInfoFetched ? `Hello ${myInfo}` : "Loading"}</h1>
        <h2 className="text-muted-foreground">{isMounted && `Roles: ${isLoaded ? roles.join(", ") : "Loading"}`}</h2>
      </div>
      <section className="flex flex-row flex-wrap gap-4">
        <a href={"/patients"}>
          <Button color="primary">Patients</Button>
        </a>
      </section>
    </div>
  )
}
