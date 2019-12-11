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

    function initBet(uint256 amount) public returns (bool) {
        balances[msg.sender].sub(amount, "ERC20: transfer amount exceeds balance");
        lockedAmount = amount;
        return true;
    }

    function submitResult(int r) public returns (bool) {

        if (lockedAmount == 0)
            return false;

        if (r == 1 + 1) {
            balances[msg.sender].add(lockedAmount);
            return true;
        }else {
            return false;
        }


        submitResult(2);
    }



}