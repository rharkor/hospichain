// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./role-manager.sol";

contract Treatments is AccessControl {
  RoleManager roleManager;

  struct Treatment {
    string Treatment_type;
    string prescriber;
    string reason;
    uint result;
    string complications;
    bool alive;
    uint date;
  }

  mapping(uint => Treatment) public treatments;
  uint public TreatmentCount;

  constructor(address roleManagerAddress) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    roleManager = RoleManager(roleManagerAddress);
  }

  modifier onlyPraticien() {
    require(roleManager.hasRole(roleManager.PRATICIEN_ROLE(), msg.sender), "Caller is not a praticien");
    _;
  }

  modifier onlyManager() {
    require(roleManager.hasRole(roleManager.MANAGER_ROLE(), msg.sender), "Caller is not a manager");
    _;
  }

  modifier onlyAdmin() {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not an admin");
    _;
  }

  function addTreatment(Treatment memory newTreatment) public onlyPraticien {
    treatments[TreatmentCount] = newTreatment;
    TreatmentCount++;
  }

  function updateTreatment(uint TreatmentId, Treatment memory updatedTreatment) public onlyPraticien {
    require(TreatmentId < TreatmentCount, "Invalid Treatment ID");
    treatments[TreatmentId] = updatedTreatment;
  }

  function setRoleManager(address roleManagerAddress) public onlyAdmin {
    roleManager = RoleManager(roleManagerAddress);
  }
}
