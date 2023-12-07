import hre from "hardhat"
import inquirer from "inquirer"
import {
  Exams__factory,
  Operations__factory,
  Patients__factory,
  Praticiens__factory,
  Results__factory,
  Societies__factory,
  Treatments__factory,
} from "../typechain-types"

async function deployRoleManager() {
  const RoleManager = await hre.ethers.getContractFactory("RoleManager")
  const roleManager = await RoleManager.deploy()
  await roleManager.waitForDeployment()
  console.log("RoleManager deployed to:", await roleManager.getAddress())
}

async function deployBasic() {
  const availablesContracts = ["Patients", "Exams", "Operations", "Praticiens", "Societes", "Treatments", "Results"]
  const contractRes = await inquirer.prompt([
    {
      name: "contract",
      type: "list",
      message: "Which contract to deploy?",
      choices: availablesContracts,
    },
  ])
  const res = await inquirer.prompt([
    {
      name: "roleManager",
      type: "input",
      message: "RoleManager address?",
    },
  ])
  //? Check if address is valid
  try {
    const code = await hre.ethers.provider.getCode(res.roleManager)
    if (code === "0x") {
      throw new Error("Invalid address provided for RoleManager")
    }
  } catch (error) {
    console.log("Invalid address provided for RoleManager")
    return
  }

  const Contract = (await hre.ethers.getContractFactory(contractRes.contract)) as
    | Patients__factory
    | Exams__factory
    | Operations__factory
    | Praticiens__factory
    | Societies__factory
    | Treatments__factory
    | Results__factory

  const contract = await Contract.deploy(res.roleManager)
  await contract.waitForDeployment()
  console.log(`Contract ${contractRes.contract} deployed to:`, await contract.getAddress())
}

async function main() {
  const res = await inquirer.prompt([
    {
      name: "which",
      type: "list",
      message: "Which contract to deploy?",
      choices: ["RoleManager", "Other"],
    },
  ])

  if (res.which === "RoleManager") {
    await deployRoleManager()
  } else if (res.which === "Other") {
    await deployBasic()
  } else {
    console.log("Not implemented")
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
