import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers"
import hre from "hardhat"

describe("Praticiens", function () {
  async function deploy() {
    // Contracts are deployed using the first signer/account by default
    const [owner, manager1, praticien1, praticien2, account5] = await hre.viem.getWalletClients()

    const roleManager = await hre.viem.deployContract("RoleManager")

    await roleManager.write.addManager([manager1.account.address, "Jean Dupont", "jdupont@mail.com"])
    await roleManager.write.addPraticien([praticien1.account.address, "Michel Martin", "mmartin@mail.com"])
    await roleManager.write.addPraticien([praticien2.account.address, "Jeanne Durand", "jdurand@mail.com"])

    const praticiens = await hre.viem.deployContract("Praticiens", [roleManager.address])

    const publicClient = await hre.viem.getPublicClient()

    return {
      praticiens,
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
