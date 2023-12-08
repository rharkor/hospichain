// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./role-manager.sol";
import "./praticiens.sol";

contract Exams is AccessControl {
  RoleManager roleManager;
  Praticiens praticiens;

  struct Exam {
    string speciality;
    string exam_type;
    uint prescriber;
    uint date;
    string reason;
    uint results;
  }

  mapping(uint => Exam) public exams;
  uint public ExamCount;

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

  function addExam(Exam memory newExam) public onlyPraticien {
    if (newExam.prescriber != 0) {
      require(!compareStrings(praticiens.getPraticien(newExam.prescriber).email, ""), "Prescriber is not a praticien");
    }
    ExamCount++;
    exams[ExamCount] = newExam;
  }

  function updateExam(uint examId, Exam memory updatedExam) public onlyPraticien {
    if (updatedExam.prescriber != 0) {
      require(
        !compareStrings(praticiens.getPraticien(updatedExam.prescriber).email, ""),
        "Prescriber is not a praticien"
      );
    }

    require(examId < ExamCount, "Invalid Exam ID");
    exams[examId] = updatedExam;
  }

  function setRoleManager(address roleManagerAddress) public onlyAdmin {
    roleManager = RoleManager(roleManagerAddress);
  }

  function GetExam(uint examId) public view returns (Exam memory) {
    require(examId <= ExamCount, "Invalid Exam ID");
    return exams[examId];
  }
}
