// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./role-manager.sol";
import "./praticiens.sol";

contract Operations is AccessControl {
  RoleManager roleManager;
  Praticiens praticiens;

  struct Operation {
    string operation_type;
    uint prescriber;
    string reason;
    uint result;
    string complications;
    bool alive;
    uint date;
  }

  mapping(uint => Operation) public operations;
  uint public operationCount;
  uint public maxLimit = 100;

  constructor(address roleManagerAddress, address praticiensAddress) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    roleManager = RoleManager(roleManagerAddress);
    praticiens = Praticiens(praticiensAddress);
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

  function compareStrings(string memory a, string memory b) public pure returns (bool) {
    return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
  }

  function addOperation(Operation memory newOperation) public onlyPraticien {
    if (newOperation.prescriber != 0) {
      require(
        !compareStrings(praticiens.getPraticien(newOperation.prescriber).email, ""),
        "Prescriber is not a praticien"
      );
    }
    operationCount++;
    operations[operationCount] = newOperation;
  }

  function updateOperation(uint operationId, Operation memory updatedOperation) public onlyPraticien {
    if (updatedOperation.prescriber != 0) {
      require(
        !compareStrings(praticiens.getPraticien(updatedOperation.prescriber).email, ""),
        "Prescriber is not a praticien"
      );
    }
    require(operationId < operationCount, "Invalid Operation ID");
    operations[operationId] = updatedOperation;
  }

  function setRoleManager(address roleManagerAddress) public onlyAdmin {
    roleManager = RoleManager(roleManagerAddress);
  }

  function getOperation(uint operationId) public view returns (Operation memory) {
    require(operationId <= operationCount, "Invalid Operation ID");
    return operations[operationId];
  }

  function getOperations(uint offset, uint limit) public view returns (Operation[] memory) {
    require(
      roleManager.hasRole(roleManager.MANAGER_ROLE(), msg.sender) ||
        roleManager.hasRole(roleManager.PRATICIEN_ROLE(), msg.sender),
      "Caller is not a manager or a praticien"
    );
    require(offset <= operationCount, "Offset is out of range");
    limit = limit > maxLimit ? maxLimit : limit;
    limit = limit > operationCount ? operationCount : limit;
    Operation[] memory _operations = new Operation[](limit);
    for (uint i = offset; i < offset + limit; i++) {
      _operations[i - offset] = operations[i + 1];
    }
    return _operations;
  }
}
