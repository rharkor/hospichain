import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers"
import { expect } from "chai"
import hre from "hardhat"
import { Patients } from "../typechain-types"

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
      const { patients, owner, manager1, account5, praticien1 } = await loadFixture(deploy)

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
      await expect(patients.write.addPatient([newPatient], { account: account5.account.address })).to.be.rejectedWith(
        "Caller is not a manager"
      )
      await expect(patients.write.addPatient([newPatient], { account: praticien1.account.address })).to.be.rejectedWith(
        "Caller is not a manager"
      )

      expect(await patients.read.patients([1], { account: manager1.account.address })).to.deep.equal([
        "Dupont",
        "Jean",
        42n,
        "French",
        "jdupont@mail.com",
        true,
        0n,
        0n,
      ])

      expect(await patients.read.getPatients([0, 1], { account: manager1.account.address })).to.deep.equal([newPatient])
    })

    it("Should update a patient", async function () {
      const { patients, manager1, praticien1 } = await loadFixture(deploy)

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

      const updatedPatient = {
        firstnames: newPatient.firstnames,
        age: newPatient.age,
        nationality: newPatient.nationality,
        email: newPatient.email,
        lastnames: "Martin",
        dead: 1,
        alive: false,
        referringDoctor: newPatient.referringDoctor,
        newExams: [],
        newOperations: [],
        newTreatements: [],
      }

      await patients.write.updatePatient([1, updatedPatient], {
        account: praticien1.account.address,
      })
      //? We can't update a patient name if we are not a manager
      expect(await patients.read.getPatients([0, 1], { account: manager1.account.address })).to.deep.equal([
        { ...newPatient, dead: 1n, alive: false },
      ])

      await patients.write.updatePatient([1, updatedPatient], {
        account: manager1.account.address,
      })
      expect(await patients.read.getPatients([0, 1], { account: manager1.account.address })).to.deep.equal([
        { ...newPatient, lastnames: "Martin", dead: 1n, alive: false },
      ])
    })

    it("Should not delete old exams, operations and treatements", async function () {
      const { patients, manager1, praticien1 } = await loadFixture(deploy)

      const newPatient = {
        lastnames: "Dupont",
        firstnames: "Jean",
        age: 42,
        nationality: "French",
        email: "jdupont@mail.com",
        alive: true,
        referringDoctor: 0,
        exams: [1, 2],
        operations: [2],
        treatements: [3],
        dead: 0,
      }

      await patients.write.addPatient([newPatient], {
        account: manager1.account.address,
      })

      const updatedPatient = {
        firstnames: newPatient.firstnames,
        age: newPatient.age,
        nationality: newPatient.nationality,
        email: newPatient.email,
        lastnames: newPatient.lastnames,
        dead: newPatient.dead,
        alive: newPatient.alive,
        referringDoctor: newPatient.referringDoctor,
        newExams: [3],
        newOperations: [3],
        newTreatements: [4, 5],
      }

      await patients.write.updatePatient([1, updatedPatient], {
        account: praticien1.account.address,
      })

      expect(await patients.read.getPatients([0, 1], { account: manager1.account.address })).to.deep.equal([
        {
          ...newPatient,
          exams: [1n, 2n, 3n],
          operations: [2n, 3n],
          treatements: [3n, 4n, 5n],
        },
      ])
    })

    it("Should correctly paginate patients", async function () {
      const { patients, manager1 } = await loadFixture(deploy)

      const patientsToAdd = 20
      const patientsPerPage = 5
      for (let i = 0; i < patientsToAdd; i++) {
        const newPatient = {
          lastnames: "Dupont",
          firstnames: "Jean",
          age: i,
          nationality: "French",
          email: "jdupont@mail.com",
          alive: true,
          referringDoctor: 0,
          exams: [1, 2],
          operations: [2],
          treatements: [3],
          dead: 0,
        }
        await patients.write.addPatient([newPatient], {
          account: manager1.account.address,
        })
      }

      const patientsPage1 = (await patients.read.getPatients([0, patientsPerPage], {
        account: manager1.account.address,
      })) as Awaited<ReturnType<Patients["patients"]>>[]
      expect(patientsPage1.length).to.equal(patientsPerPage)
      expect(patientsPage1[0].age).to.equal(0)
      expect(patientsPage1[patientsPage1.length - 1].age).to.equal(patientsPerPage - 1)
      const patientsPage2 = (await patients.read.getPatients([patientsPerPage, patientsPerPage], {
        account: manager1.account.address,
      })) as Awaited<ReturnType<Patients["patients"]>>[]
      expect(patientsPage2.length).to.equal(patientsPerPage)
      expect(patientsPage2[0].age).to.equal(patientsPerPage)
      expect(patientsPage2[patientsPage2.length - 1].age).to.equal(patientsPerPage * 2 - 1)
    })
  })
})
