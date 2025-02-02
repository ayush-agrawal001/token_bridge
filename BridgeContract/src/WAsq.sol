// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import "./IWASQ.sol";

contract WAsq is ERC20 , Ownable, IWASQ {    
    constructor() ERC20 ("WASquare", "WASQ") Ownable(msg.sender) {}

    function mint (address to, uint256 _amount) public {
        _mint(to, _amount);
    }

    function burn(address from, uint256 _amount) public {
        _burn(from, _amount);
    }
}

// Relased by us.