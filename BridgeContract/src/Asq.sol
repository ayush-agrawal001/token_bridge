// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Asq is ERC20 {
    constructor() ERC20 ("ASquare", "ASQ"){
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint (address to, uint256 amount) public {
        _mint(to, amount);
    }
}

// ONLY FOR TESTING
// This is the original token that is on-chain (ETH)!