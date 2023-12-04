"use client"

import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react"

import { arbitrum, mainnet, polygonMumbai } from "viem/chains"
import { WagmiConfig } from "wagmi"

const projectId = "5012f0580e4b7e672d40f341fdcef9cf"

const chains = [mainnet, arbitrum, polygonMumbai]
const wagmiConfig = defaultWagmiConfig({ chains, projectId })

createWeb3Modal({ wagmiConfig, projectId, chains })

export function Web3Modal({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
}
