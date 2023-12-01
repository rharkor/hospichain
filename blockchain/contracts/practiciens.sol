// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./role-manager.sol";

contract Praticiens {
     RoleManager roleManager;

    struct Praticien {
        string lastname;
        string  firstname;
        string email;
        uint societe;
        uint debut;
        string status;
    }

    mapping(uint => Praticien) public practiciens;

    uint public PracticienCount;

    constructor(address roleManagerAddress) {
    roleManager = RoleManager(roleManagerAddress);
  }

  function test() public view {
    if (!roleManager.hasRole(roleManager.MANAGER_ROLE(), msg.sender)) {
      revert("You are not a MANAGER");
    }
  }

  function addPracticien(Praticien memory newPraticien) public {
    if (!roleManager.hasRole(roleManager.MANAGER_ROLE(), msg.sender)) {
      revert("You are not a MANAGER");

      practiciens[PracticienCount] = newPraticien;
      PracticienCount++;
    }
  }
    
}
