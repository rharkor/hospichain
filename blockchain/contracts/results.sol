// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./role-manager.sol";

contract Results is AccessControl{
     RoleManager roleManager;

    struct Result {
        string name;
        string  description;
        uint date;
    }

  mapping(uint => Result) public results;
  uint public ResultCount;

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

  function addResult(Result memory newResult) public onlyManager{
    results[ResultCount] = newResult;
    ResultCount++;
  }

  function updateResult(uint resultId, Result memory updatedResult) public onlyManager{
    require(resultId < ResultCount, "Invalid Practicien ID");
    results[resultId] = updatedResult;
  }

  function setRoleManager(address roleManagerAddress) public onlyAdmin {
    roleManager = RoleManager(roleManagerAddress);
  }
    
}
