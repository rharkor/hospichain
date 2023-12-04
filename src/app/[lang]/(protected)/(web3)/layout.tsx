"use client"

import { useWeb3Modal } from "@web3modal/wagmi/react"
import { useEffect } from "react"
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi"
import Web3RoleProvider from "@/contexts/web3role/provider"

const chainId = 80001
export default function Web3Layout({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork({
    chainId,
  })
  const { open } = useWeb3Modal()

  useEffect(() => {
    if (!isConnected) {
      open()
    }
  }, [isConnected, open])

  useEffect(() => {
    if (chain?.id !== chainId) {
      switchNetwork?.()
    }
  }, [chain, switchNetwork])

  return <Web3RoleProvider>{children}</Web3RoleProvider>
}
