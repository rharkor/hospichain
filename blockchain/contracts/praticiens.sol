// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./role-manager.sol";
import "./societies.sol";

contract Praticiens is AccessControl {
  RoleManager roleManager;
  Societies societies;

  struct Praticien {
    string lastname;
    string firstname;
    string email;
    uint society;
    string debut;
    string status;
  }

  mapping(uint => Praticien) public praticiens;
  uint public PraticienCount;

  constructor(address roleManagerAddress, address societiesAddress) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    roleManager = RoleManager(roleManagerAddress);
    societies = Societies(societiesAddress);
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

  function addPraticien(Praticien memory newPraticien) public onlyManager {
    //* Check valid data
    // Check that the society is valid
    if (newPraticien.society != 0) {
      require(!compareStrings(societies.getSociety(newPraticien.society).siret, ""), "Society is not a praticien");
    }
    praticiens[PraticienCount] = newPraticien;
    PraticienCount++;
  }

  function updatePraticien(uint praticienId, Praticien memory updatedPraticien) public onlyManager {
    require(praticienId < PraticienCount, "Invalid Praticien ID");
    //* Check valid data
    // Check that the society is valid
    if (updatedPraticien.society != 0) {
      require(!compareStrings(societies.getSociety(updatedPraticien.society).siret, ""), "Society is not a praticien");
    }
    praticiens[praticienId] = updatedPraticien;
  }

  function setRoleManager(address roleManagerAddress) public onlyAdmin {
    roleManager = RoleManager(roleManagerAddress);
  }

  function getPraticien(uint praticienId) public view returns (Praticien memory) {
    require(praticienId < PraticienCount, "Invalid Praticien ID");
    return praticiens[praticienId];
  }

  function setSocieties(address societiesAddress) public onlyAdmin {
    societies = Societies(societiesAddress);
  }
}
