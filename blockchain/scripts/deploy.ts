import hre from "hardhat"
import inquirer from "inquirer"

async function deployRoleManager() {
  const RoleManager = await hre.ethers.getContractFactory("RoleManager")
  const roleManager = await RoleManager.deploy()
  await roleManager.waitForDeployment()
  console.log("RoleManager deployed to:", await roleManager.getAddress())
}

async function deployPatients() {
  const Patients = await hre.ethers.getContractFactory("Patients")
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

  const patients = await Patients.deploy(res.roleManager)
  await patients.waitForDeployment()
  console.log("Patients deployed to:", await patients.getAddress())
}

async function main() {
  const res = await inquirer.prompt([
    {
      name: "which",
      type: "list",
      message: "Which contract to deploy?",
      choices: ["RoleManager", "Patients"],
    },
  ])

  if (res.which === "RoleManager") {
    await deployRoleManager()
  } else if (res.which === "Patients") {
    await deployPatients()
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
