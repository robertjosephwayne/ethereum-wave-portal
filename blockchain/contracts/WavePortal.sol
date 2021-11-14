// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    mapping(address => uint256) public lastWavedAt;
    mapping(address => string) public username;

    constructor() payable {
        console.log("WavePortal contract constructor called.");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        require(lastWavedAt[msg.sender] + 30 seconds < block.timestamp, "Must wait 30 seconds before waving again.");
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        
        console.log("%s has waved!", msg.sender);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns(Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

    function setUsername(bytes32 memory _username) public {
        username[msg.sender] = _username;
    }
}

