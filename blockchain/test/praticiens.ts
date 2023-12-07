import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers"
import { expect } from "chai"
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
      roleManager,
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

    it("Should have the correct owner", async function () {
      const { praticiens, owner } = await loadFixture(deploy)

      expect(await praticiens.read.hasRole([await praticiens.read.DEFAULT_ADMIN_ROLE(), owner.account.address])).to.equal(
        true
      )
    })
  })

  describe("Praticien", function () {
    it("Should add a praticien", async function () {
      const { roleManager, praticiens, owner, manager1, account5, praticien1 } = await loadFixture(deploy)

      const newPraticien = {
        lastnames: "Martin",
        firstnames: "Marcel",
        email: "marcel.martin04@mail.com",
        society: 12345,
        debut: "12/04/2019",
        statu: "en activité"
      }

      await praticiens.write.addPraticien([newPraticien], {
        account: manager1.account.address,
      })

      await expect(praticiens.write.addPraticien([newPraticien], { account: owner.account.address })).to.be.rejectedWith(
        "Caller is not a manager"
      )
    })
  })
})
