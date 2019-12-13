pragma solidity ^0.5.0;

import "./ERC20.sol";

contract MyToken is ERC20 {

    string  public name     = 'MyToken';
    uint8   public decimals = 18;
    string  public symbol   = 'MYT';
    string  public version  = '1.0.0';

    constructor () public {
        _mint(msg.sender, 100000000 * 10 ** 18);
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function getDecimals() public view returns (uint8) {
        return decimals;
    }

    function getSymbol() public view returns (string memory) {
        return symbol;
    }

    function getVersion() public view returns (string memory) {
        return version;
    }

}
