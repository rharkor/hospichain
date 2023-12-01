import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
  import { expect } from "chai";
  import hre from "hardhat";
  import { getAddress, parseGwei } from "viem";
  
  describe("Patients", function () {
    async function deploy() {
      // Contracts are deployed using the first signer/account by default
      const [owner, otherAccount] = await hre.viem.getWalletClients();
  
      const roleManager = await hre.viem.deployContract("RoleManager");

      const patients = await hre.viem.deployContract("Patients");
  
      const publicClient = await hre.viem.getPublicClient();
  
      return {
        patients,
        owner,
        otherAccount,
        publicClient,
      };
    }
  
    describe("Deployment", function () {
      it("Should deploy correctly", async function () {
        const { patients } = await loadFixture(deploy);
  
      });
    });

  });
  