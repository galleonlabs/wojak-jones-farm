// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@5.0.0/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts@5.0.0/token/ERC20/extensions/ERC20Permit.sol";

contract Crops is ERC20, ERC20Permit {
    constructor() ERC20("Harvested Crops", "CROPS") ERC20Permit("Crops") {
        _mint(msg.sender, 10000000 * 10 ** decimals());
    }
}
