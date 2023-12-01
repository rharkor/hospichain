// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract RoleManager is AccessControl {
  bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
  bytes32 public constant PRATICIEN_ROLE = keccak256("PRATICIEN_ROLE");

  constructor() {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  function addManager(address _account) public {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not an admin");
    grantRole(MANAGER_ROLE, _account);
  }

  function addPraticien(address _account) public {
    require(
      hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || hasRole(MANAGER_ROLE, msg.sender),
      "Caller is not an admin or a manager"
    );
    grantRole(PRATICIEN_ROLE, _account);
  }
}
