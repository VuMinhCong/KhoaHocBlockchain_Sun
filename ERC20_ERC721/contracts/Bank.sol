// SPDX-License-Identifier:GPL-3.0
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract Bank {
    using SafeMath for uint256;

    mapping(address => mapping(address => uint256)) internal _balance;

    event Deposit(address indexed user, address indexed token, uint256 amount);
    event Withdraw(address indexed user, address indexed token, uint256 amount);

    constructor() public {}

    function depositERC20(address token, uint256 amount) external {
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        _balance[token][msg.sender] = _balance[token][msg.sender].add(amount);
        emit Deposit(msg.sender, token, amount);
    }

    function withdrawERC20(address token, uint256 amount) external {
        IERC20(token).transfer(msg.sender, amount);
        _balance[token][msg.sender] = _balance[token][msg.sender].sub(amount);
        emit Withdraw(msg.sender, token, amount);
    }

    function depositETH() external payable {
        _balance[address(0)][msg.sender] = _balance[address(0)][msg.sender].add(msg.value);
        emit Deposit(msg.sender, address(0), msg.value);
    }

    function withdrawETH(uint256 amount, address receiver) external {
        if (Address.isContract(receiver)) {
            (bool success, ) = receiver.call{value: amount}(
                abi.encodeWithSignature("receiveETH()")
            );
            require(success, "External call failed");
        } else {
            payable(msg.sender).transfer(amount);
        }
        _balance[address(0)][msg.sender] = _balance[address(0)][msg.sender].sub(amount);
        emit Withdraw(msg.sender, address(0), amount);
    }
}
