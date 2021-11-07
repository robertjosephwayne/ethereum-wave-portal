// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    // State variable to hold the total number of waves.
    uint256 totalWaves;

    constructor() {
        console.log("WavePortal contract constructor called.");
    }

    function wave() public {
        totalWaves += 1;
        // msg.sender is the wallet address of the person who called this function.
        console.log("%s has waved!", msg.sender);
    }

}

