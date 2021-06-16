// SPDX-License-Identifier:GPL-3.0
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenERC20 is ERC20 {
    constructor(string memory name, string memory symbol) public ERC20(name, symbol) {}

    function mint(address user, uint256 amount) external {
        _mint(user, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
