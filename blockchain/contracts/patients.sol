// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./role-manager.sol";
import "./praticiens.sol";
import "./exams.sol";

contract Patients is AccessControl {
  RoleManager roleManager;
  Praticiens praticiens;
  Exams exams;

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

  constructor(address roleManagerAddress, address praticiensAddress, address examsAddress) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    roleManager = RoleManager(roleManagerAddress);
    praticiens = Praticiens(praticiensAddress);
    exams = Exams(examsAddress);
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

  function addPatient(Patient memory newPatient) public onlyManager {
    //* Check valid data
    // Check that the referring doctor is a praticien
    if (newPatient.referringDoctor != 0) {
      require(
        compareStrings(praticiens.getPraticien(newPatient.referringDoctor).email, ""),
        "Referring doctor is not a praticien"
      );
    }

    //* Add
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
    //* Check valid data
    // Check that the referring doctor is a praticien
    if (newPatient.referringDoctor != 0) {
      require(
        compareStrings(praticiens.getPraticien(newPatient.referringDoctor).email, ""),
        "Referring doctor is not a praticien"
      );
    }
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

        require(!compareStrings(exams.GetExam(newPatient.newExams[i]).exam_type,""), 'Invalid exam ID');
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

  function setPraticiens(address praticiensAddress) public onlyAdmin {
    praticiens = Praticiens(praticiensAddress);
  }
}
