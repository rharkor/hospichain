// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./role-manager.sol";

contract Operations is AccessControl {
  RoleManager roleManager;

  struct Operation {
    string operation_type;
    string prescriber;
    string reason;
    uint result;
    string complications;
    bool alive;
    uint date;
  }

  mapping(uint => Operation) public operations;
  uint public OperationCount;

  constructor(address roleManagerAddress) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    roleManager = RoleManager(roleManagerAddress);
  }

  modifier onlyPracticien() {
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

  function addOperation(Operation memory newOperation) public onlyPracticien {
    operations[OperationCount] = newOperation;
    OperationCount++;
  }

  function updateOperation(uint OperationId, Operation memory updatedOperation) public onlyPracticien {
    require(OperationId < OperationCount, "Invalid Operation ID");
    operations[OperationId] = updatedOperation;
  }

  function setRoleManager(address roleManagerAddress) public onlyAdmin {
    roleManager = RoleManager(roleManagerAddress);
  }
}
