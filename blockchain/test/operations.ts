import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers"
import { expect } from "chai"
import hre from "hardhat"

describe("Operations", function () {
  async function deploy() {
    // Contracts are deployed using the first signer/account by default
    const [owner, manager1, praticien1, praticien2, account5] = await hre.viem.getWalletClients()

    const roleManager = await hre.viem.deployContract("RoleManager")

    await roleManager.write.addManager([manager1.account.address, "Jean Dupont", "jdupont@mail.com"])
    await roleManager.write.addPraticien([praticien1.account.address, "Michel Martin", "mmartin@mail.com"])
    await roleManager.write.addPraticien([praticien2.account.address, "Jeanne Durand", "jdurand@mail.com"])

    const societies = await hre.viem.deployContract("Societies", [roleManager.address])
    const praticiens = await hre.viem.deployContract("Praticiens", [roleManager.address, societies.address])
    const operations = await hre.viem.deployContract("Operations", [roleManager.address, praticiens.address])
    const publicClient = await hre.viem.getPublicClient()

    return {
      roleManager,
      praticiens,
      operations,
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

      expect(
        await praticiens.read.hasRole([await praticiens.read.DEFAULT_ADMIN_ROLE(), owner.account.address])
      ).to.equal(true)
    })
  })

  describe("Operations", function () {
    it("Should add a operation", async function () {
      const { roleManager, praticiens, operations, owner, manager1, account5, praticien1 } = await loadFixture(deploy)

      const newPraticien = {
        lastnames: "Martin",
        firstnames: "Marcel",
        email: "marcel.martin04@mail.com",
        society: 0n,
        debut: "12/04/2019",
        statu: "en activité",
      }

      await praticiens.write.addPraticien([newPraticien], {
        account: manager1.account.address,
      })

      const newOperation = {
        operation_type: "chirurgie vasculaire",
        prescriber: 1n,
        reason: "Problème lier à l'âge",
        result: 0n,
        complications: "aucune",
        alive: true,
        date: 0n,
      }

      await operations.write.addOperation([newOperation], {
        account: praticien1.account.address,
      })

      await expect(
        operations.write.addOperation([newOperation], {
          account: manager1.account.address,
        })
      ).to.be.rejectedWith("Caller is not a praticien")

      expect(
        await operations.read.getOperations([0, 1], {
          account: praticien1.account.address,
        })
      ).to.deep.equal([
        {
          operation_type: "chirurgie vasculaire",
          prescriber: 1n,
          reason: "Problème lier à l'âge",
          result: 0n,
          complications: "aucune",
          alive: true,
          date: 0n,
        },
      ])
    })
  })
})
