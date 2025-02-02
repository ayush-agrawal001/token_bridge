// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { console } from "forge-std/console.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import "./IWASQ.sol";

contract BridgePol is Ownable {
    address public tokenAddress;

    event Burned(address indexed burner, uint256 _amount);

    mapping(address => uint256) public pendingBalance;

    constructor(address _tokenAddress) Ownable(msg.sender) {
        tokenAddress = _tokenAddress;
    }

    function burn(IWASQ _tokenAddress,uint256 _amount) public {
        require(address(_tokenAddress) == tokenAddress, "Wrong token Address");
        require(_tokenAddress.allowance(msg.sender, address(this)) == _amount, "No allowance found to burn token");
        _tokenAddress.transferFrom(msg.sender, address(this), _amount);
        _tokenAddress.burn(msg.sender, _amount);
        emit Burned(msg.sender, _amount);
    }

    function withdraw( IWASQ _tokenAdress, uint256 _amount ) public {
        require(address(_tokenAdress) == tokenAddress, "Wrong token address");
        require(pendingBalance[msg.sender] >= _amount, "No Pending balance associated to this A/c");
        pendingBalance[msg.sender] -= _amount;
        _tokenAdress.mint(msg.sender, _amount);
    }

    function depositedOnOtherSide(address userAccount, uint256 _amount) public onlyOwner {
        pendingBalance[userAccount] += _amount;
    }

}
