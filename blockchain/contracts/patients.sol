// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./role-manager.sol";

contract Patients is AccessControl {
  RoleManager roleManager;

  uint public maxLimit = 100;

  struct Patient {
    string lastnames;
    string firstnames;
    uint age;
    string nationality;
    string email;
    bool alive;
    uint referringDoctor;
    uint[] exams;
    uint[] operations;
    uint[] treatements;
    uint dead;
  }

  mapping(uint => Patient) public patients;
  uint public patientCount;

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

  function addPatient(Patient memory newPatient) public onlyManager {
    patientCount++;
    patients[patientCount] = newPatient;
  }

  function getPatients(uint offset, uint limit) public view returns (Patient[] memory) {
    require(
      roleManager.hasRole(roleManager.MANAGER_ROLE(), msg.sender) ||
        roleManager.hasRole(roleManager.PRATICIEN_ROLE(), msg.sender),
      "Caller is not a manager or a praticien"
    );
    require(offset <= patientCount, "Offset is out of range");
    limit = limit > maxLimit ? maxLimit : limit;
    limit = limit > patientCount ? patientCount : limit;
    Patient[] memory _patients = new Patient[](limit);
    for (uint i = offset; i < offset + limit; i++) {
      _patients[i - offset] = patients[i + 1];
    }
    return _patients;
  }

  function setRoleManager(address roleManagerAddress) public onlyAdmin {
    roleManager = RoleManager(roleManagerAddress);
  }
}
