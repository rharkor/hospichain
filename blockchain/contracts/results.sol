// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./role-manager.sol";

contract Results is AccessControl {
  RoleManager roleManager;

  struct Result {
    string name;
    string description;
    uint date;
  }

  mapping(uint => Result) public results;
  uint public ResultCount;

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

  function addResult(Result memory newResult) public onlyPracticien {
    results[ResultCount] = newResult;
    ResultCount++;
  }

  function updateResult(uint resultId, Result memory updatedResult) public onlyPracticien {
    require(resultId < ResultCount, "Invalid Result ID");
    results[resultId] = updatedResult;
  }

  function setRoleManager(address roleManagerAddress) public onlyAdmin {
    roleManager = RoleManager(roleManagerAddress);
  }
}
