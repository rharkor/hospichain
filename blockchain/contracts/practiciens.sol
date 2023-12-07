// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./role-manager.sol";

contract Praticiens is AccessControl {
  RoleManager roleManager;

  struct Praticien {
    string lastname;
    string firstname;
    string email;
    uint societe;
    uint debut;
    string status;
  }

  mapping(uint => Praticien) public practiciens;
  uint public PracticienCount;

  constructor(address roleManagerAddress) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    roleManager = RoleManager(roleManagerAddress);
  }

  modifier onlyManager() {
    require(roleManager.hasRole(roleManager.MANAGER_ROLE(), msg.sender), "Caller is not a manager");
    _;
  }

  modifier onlyAdmin() {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not an admin");
    _;
  }

  function addPracticien(Praticien memory newPraticien) public onlyManager {
    practiciens[PracticienCount] = newPraticien;
    PracticienCount++;
  }

  function updatePracticien(uint praticienId, Praticien memory updatedPraticien) public onlyManager {
    require(praticienId < PracticienCount, "Invalid Practicien ID");
    practiciens[praticienId] = updatedPraticien;
  }

  function setRoleManager(address roleManagerAddress) public onlyAdmin {
    roleManager = RoleManager(roleManagerAddress);
  }
}
