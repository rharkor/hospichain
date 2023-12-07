// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./role-manager.sol";

contract Societies is AccessControl {
  RoleManager roleManager;

  struct Society {
    string name;
    string siret;
    uint location;
  }
  mapping(uint => Society) public societies;
  uint public SocietyCount;

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

  function addSociety(Society memory newSociety) public onlyManager {
    societies[SocietyCount] = newSociety;
    SocietyCount++;
  }

  function updatePracticien(uint societyId, Society memory updatedSociety) public onlyManager {
    require(societyId < SocietyCount, "Invalid Society ID");
    societies[societyId] = updatedSociety;
  }

  function setRoleManager(address roleManagerAddress) public onlyAdmin {
    roleManager = RoleManager(roleManagerAddress);
  }
}
