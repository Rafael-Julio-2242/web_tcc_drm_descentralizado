// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DigitalAsset.sol";

contract DigitalAssetFactory {
    address[] public deployedTokens;

    event TokenCreated(
        address indexed tokenAddress,
        string name,
        string symbol
    );

    function createToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) public returns (address) {
        DigitalAsset newToken = new DigitalAsset(
            name,
            symbol,
            initialSupply,
            msg.sender
        );
        address tokenAddr = address(newToken);
        deployedTokens.push(tokenAddr);
        emit TokenCreated(tokenAddr, name, symbol);
        return tokenAddr;
    }

    function getAllTokens() public view returns (address[] memory) {
        return deployedTokens;
    }
}
