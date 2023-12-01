import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox-viem"
import "@nomicfoundation/hardhat-toolbox"
import "hardhat-abi-exporter"
import "@typechain/hardhat"
import "@nomicfoundation/hardhat-ethers"
import "@nomicfoundation/hardhat-chai-matchers"
import * as fs from "fs"

const defaultNetwork: string = "hardhat"

function pkey() {
  try {
    const pkey = fs.readFileSync("./pkey.txt", "utf-8").toString().trim()
    if (pkey.length !== 64) throw new Error("Invalid private key")
    return pkey
  } catch (e) {
    console.error("Error reading pkey.txt, please create it and put your private key in it")
    throw "Invalid private key"
  }
}

const config: HardhatUserConfig = {
  defaultNetwork,
  networks: {
    hardhat: {},
    localhost: {
      url: "http://localhost:8545",
    },
    polygon: {
      url: "https://polygon-rpc.com",
      chainId: 137,
      accounts: [pkey()],
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [pkey()],
      chainId: 80001,
    },
  },
  solidity: {
    version: "0.8.19",
  },
  abiExporter: {
    path: "./abi",
    clear: true,
    runOnCompile: true,
  },
}

export default config
