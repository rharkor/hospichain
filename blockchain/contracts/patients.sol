// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./role-manager.sol";

contract Patients {
  RoleManager roleManager;

  struct Patient {
    string lastnames;
    string firstnames;
    uint age;
    string nationality;
    string email;
    bool alive;
    uint referringDoctor;
    uint[] exams;
    uint[] operations;
    uint[] treatements;
    uint dead;
  }

  mapping(uint => Patient) public patients;
  uint public patientCount;

  constructor(address roleManagerAddress) {
    roleManager = RoleManager(roleManagerAddress);
  }

  function test() public view {
    if (!roleManager.hasRole(roleManager.MANAGER_ROLE(), msg.sender)) {
      revert("You are not a MANAGER");
    }
  }

  function addPatient(Patient memory newPatient) public {
      if (!roleManager.hasRole(roleManager.MANAGER_ROLE(), msg.sender)) {
         revert("You are not a MANAGER");
      }
      patientCount++;
      patients[patientCount] = newPatient;
  }
}
