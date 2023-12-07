// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./role-manager.sol";

contract Exams is AccessControl {
  RoleManager roleManager;

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

  function addExam(Exam memory newExam) public onlyPracticien {
    exams[ExamCount] = newExam;
    ExamCount++;
  }

  function updateExam(uint examId, Exam memory updatedExam) public onlyPracticien {
    require(examId < ExamCount, "Invalid Exam ID");
    exams[examId] = updatedExam;
  }

  function setRoleManager(address roleManagerAddress) public onlyAdmin {
    roleManager = RoleManager(roleManagerAddress);
  }
}
