// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Patients {
   
   struct Patient {
    lastnames: string,
    firstnames: string,
    age: uint
    nationality: string,
    email: string,
    alive: bool,
    referring doctor: uint,
    exams: uint[],
    operations: uint[],
    treatements: uint[],
    dead: uint
   }

   mapping (uint => Patient) public patients;

   uint public patientCount;

   function addPatient {}
}
