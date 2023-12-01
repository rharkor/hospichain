import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers"
import hre from "hardhat"

describe("Patients", function () {
  async function deploy() {
    // Contracts are deployed using the first signer/account by default
    const [owner, manager1, praticien1, praticien2, account5] = await hre.viem.getWalletClients()

    const roleManager = await hre.viem.deployContract("RoleManager")

    await roleManager.write.addManager([manager1.account.address])
    await roleManager.write.addPraticien([praticien1.account.address])
    await roleManager.write.addPraticien([praticien2.account.address])

    const patients = await hre.viem.deployContract("Patients", [roleManager.address])

    const publicClient = await hre.viem.getPublicClient()

    return {
      patients,
      owner,
      manager1,
      praticien1,
      praticien2,
      account5,
      publicClient,
    }
  }

  describe("Deployment", function () {
    it("Should deploy correctly", async function () {
      await loadFixture(deploy)
    })
  })
})
