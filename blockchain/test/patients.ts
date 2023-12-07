import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers"
import { expect } from "chai"
import hre from "hardhat"

describe("Patients", function () {
  async function deploy() {
    // Contracts are deployed using the first signer/account by default
    const [owner, manager1, praticien1, praticien2, account5] = await hre.viem.getWalletClients()

    const roleManager = await hre.viem.deployContract("RoleManager")

    await roleManager.write.addManager([manager1.account.address, "Jean Dupont", "jdupont@mail.com"])
    await roleManager.write.addPraticien([praticien1.account.address, "Michel Martin", "mmartin@mail.com"])
    await roleManager.write.addPraticien([praticien2.account.address, "Jeanne Durand", "jdurand@mail.com"])

    const patients = await hre.viem.deployContract("Patients", [roleManager.address])

    const publicClient = await hre.viem.getPublicClient()

    return {
      roleManager,
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

    it("Should have the correct owner", async function () {
      const { patients, owner } = await loadFixture(deploy)

      expect(await patients.read.hasRole([await patients.read.DEFAULT_ADMIN_ROLE(), owner.account.address])).to.equal(
        true
      )
    })
  })

  describe("Patients", function () {
    it("Should add a patient", async function () {
      const { roleManager, patients, owner, manager1, account5, praticien1 } = await loadFixture(deploy)

      const newPatient = {
        lastnames: "Dupont",
        firstnames: "Jean",
        age: 42,
        nationality: "French",
        email: "jdupont@mail.com",
        alive: true,
        referringDoctor: 0,
        exams: [],
        operations: [],
        treatements: [],
        dead: 0,
      }

      await patients.write.addPatient([newPatient], {
        account: manager1.account.address,
      })

      await expect(patients.write.addPatient([newPatient], { account: owner.account.address })).to.be.rejectedWith(
        "Caller is not a manager"
      )
    })
  })
})
