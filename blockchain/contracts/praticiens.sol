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
    uint society;
    string debut;
    string status;
  }

  mapping(uint => Praticien) public praticiens;
  uint public PraticienCount;

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

  function addPraticien(Praticien memory newPraticien) public onlyManager{
    praticiens[PraticienCount] = newPraticien;
    PraticienCount++;
  }

  function updatePraticien(uint praticienId, Praticien memory updatedPraticien) public onlyManager{
    require(praticienId < PraticienCount, "Invalid Praticien ID");
    praticiens[praticienId] = updatedPraticien;
  }

  function setRoleManager(address roleManagerAddress) public onlyAdmin {
    roleManager = RoleManager(roleManagerAddress);
  }
}
