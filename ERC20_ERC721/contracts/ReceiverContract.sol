// SPDX-License-Identifier:GPL-3.0
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Bank.sol";

contract ReceiverContract {
    Bank public bank;
    uint256 public withdrawnAmount;
    address payable public owner;

    constructor(address _bankAddress) public payable {
        bank = Bank(_bankAddress);
        owner = msg.sender;
    }

    function depositToBank() external payable {
        bank.depositETH{value: 1 ether}();
    }

    function withdrawFromBank() external {
        bank.withdrawETH(1 ether, address(this));
    }

    function withdraw() external {
        owner.transfer(address(this).balance);
    }

    function receiveETH() external payable {}

    fallback() external payable {}
}
