// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import { BridgeEth } from  "../src/bridgeEth.sol";
import { BridgePol } from "../src/bridgePol.sol";
import { Asq } from "../src/Asq.sol";
import { WAsq } from "../src/WAsq.sol";

import "../src/IWASQ.sol";

contract TestContract is Test {
    
    BridgeEth public bridgeEth;
    BridgePol public bridgePol;
    Asq public asq; // Token To Bridge (Not our token)
    IWASQ public wasq; // Token that we are Minting and burning

    event Deposit(address indexed depositor, uint amount);
    event Burned(address indexed burner, uint256 _amount);

    address owner = address(1); // Owner of the contract (who will deploy on chain)
    address user = address(2); // User who wants to bridge there Assets
    

    function setUp() public {
        vm.startPrank(owner);

        asq = new Asq(); // (For only testing) deployed it with the owner address
        wasq = new WAsq();
        bridgeEth = new BridgeEth(address(asq));
        bridgePol = new BridgePol(address(wasq));

        vm.stopPrank();
    }

    function testEthToPolBridge() public {
        uint256 amount = 100 * 10 ** asq.decimals();
        asq.mint(user, amount);
        
        vm.startPrank(user);
        asq.approve(address(bridgeEth), amount);

        assertEq(asq.allowance(user, address(bridgeEth)), amount);

        vm.expectEmit(true, false, false, true);
        emit Deposit(user, amount);
        bridgeEth.deposit(asq, amount);
        vm.stopPrank();

        vm.prank(owner);
        bridgePol.depositedOnOtherSide(user, amount); // From the Node.js which is polling every blocks

        vm.startPrank(user);
        bridgePol.withdraw(wasq, amount);
        assertEq(wasq.balanceOf(user), amount);
        vm.stopPrank();
    }

    function testPolToEthBridge() public {
        uint256 amount = 100 * 10 ** asq.decimals();
        wasq.mint(user, 200 * 10 ** asq.decimals());
        asq.mint(address(bridgeEth), amount);

        vm.startPrank(user);

        wasq.approve(address(bridgePol), amount);

        vm.expectEmit(true, false, false, true);
        emit Burned(user, amount);
        
        bridgePol.burn(wasq, amount);
        
        vm.stopPrank();

        vm.prank(owner);
        bridgeEth.burnedOnOppositeChain(user, amount);

        vm.startPrank(user);

        bridgeEth.withdraw(asq, amount);
        assertEq(asq.balanceOf(user), amount);

        vm.stopPrank();

    }

}
