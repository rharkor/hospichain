// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract RoleManager is AccessControl {
  bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
  bytes32 public constant PRATICIEN_ROLE = keccak256("PRATICIEN_ROLE");

  struct AddressInfo {
    string name;
    string email;
  }

  mapping(address => AddressInfo) public addressInfos;

  constructor() {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    addressInfos[msg.sender] = AddressInfo("Admin", "admin@mail.com");
  }

  function addManager(address account, string memory name, string memory email) public {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not an admin");
    grantRole(MANAGER_ROLE, account);
    addressInfos[account] = AddressInfo(name, email);
  }

  function addPraticien(address account, string memory name, string memory email) public {
    require(
      hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || hasRole(MANAGER_ROLE, msg.sender),
      "Caller is not an admin or a manager"
    );
    grantRole(PRATICIEN_ROLE, account);
    addressInfos[account] = AddressInfo(name, email);
  }

  function updateAddressInfo(address _address, string memory name, string memory email) public {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || msg.sender == _address, "Caller is not an admin or the address");
    addressInfos[_address] = AddressInfo(name, email);
  }

  function getRoles(address _address) public view returns (string[] memory) {
    string[] memory roles = new string[](3);
    uint8 index = 0;
    if (hasRole(DEFAULT_ADMIN_ROLE, _address)) {
      roles[index++] = "DEFAULT_ADMIN_ROLE";
    }
    if (hasRole(MANAGER_ROLE, _address)) {
      roles[index++] = "MANAGER_ROLE";
    }
    if (hasRole(PRATICIEN_ROLE, _address)) {
      roles[index++] = "PRATICIEN_ROLE";
    }
    return roles;
  }
}
