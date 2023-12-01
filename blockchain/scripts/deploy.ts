import hre from "hardhat"
import inquirer from "inquirer"

async function deployRoleManager() {
  const RoleManager = await hre.ethers.getContractFactory("RoleManager")
  const roleManager = await RoleManager.deploy()
  await roleManager.waitForDeployment()
  console.log("RoleManager deployed to:", await roleManager.getAddress())
}

async function main() {
  const res = await inquirer.prompt([
    {
      name: "which",
      type: "list",
      message: "Which contract to deploy?",
      choices: ["RoleManager"],
    },
  ])

  if (res.which === "RoleManager") {
    await deployRoleManager()
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
