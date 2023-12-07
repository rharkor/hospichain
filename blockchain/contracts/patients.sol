// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

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

  struct UpdatePatient {
    string lastnames;
    string firstnames;
    uint age;
    string nationality;
    string email;
    bool alive;
    uint referringDoctor;
    uint[] newExams;
    uint[] newOperations;
    uint[] newTreatements;
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

  function updatePatient(uint id, UpdatePatient memory newPatient) public {
    require(
      roleManager.hasRole(roleManager.MANAGER_ROLE(), msg.sender) ||
        roleManager.hasRole(roleManager.PRATICIEN_ROLE(), msg.sender),
      "Caller is not a manager or a praticien"
    );
    require(id <= patientCount, "Patient id is out of range");
    if (roleManager.hasRole(roleManager.MANAGER_ROLE(), msg.sender)) {
      patients[id].lastnames = newPatient.lastnames;
      patients[id].firstnames = newPatient.firstnames;
      patients[id].age = newPatient.age;
      patients[id].nationality = newPatient.nationality;
      patients[id].email = newPatient.email;
      patients[id].referringDoctor = newPatient.referringDoctor;
    }
    //? Update exams, operations, treatements and dead
    if (newPatient.newExams.length > 0) {
      for (uint i = 0; i < newPatient.newExams.length; i++) {
        patients[id].exams.push(newPatient.newExams[i]);
      }
    }
    if (newPatient.newOperations.length > 0) {
      for (uint i = 0; i < newPatient.newOperations.length; i++) {
        patients[id].operations.push(newPatient.newOperations[i]);
      }
    }
    if (newPatient.newTreatements.length > 0) {
      for (uint i = 0; i < newPatient.newTreatements.length; i++) {
        patients[id].treatements.push(newPatient.newTreatements[i]);
      }
    }
    if (patients[id].dead == 0) {
      patients[id].dead = newPatient.dead;
    }
    patients[id].alive = newPatient.alive;
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
