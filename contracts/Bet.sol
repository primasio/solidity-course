pragma solidity ^0.5.0;

import "./SafeMath.sol";

contract Bet {

    using SafeMath for uint256;

    mapping (address => uint256) private _balances;

    uint256 lockedAmount = 0;

    constructor () public {}

    function addBalance(uint256 amount) public {
        _balances[msg.sender] = _balances[msg.sender].add(amount);
    }

    function getBalance(address account) public view returns (uint256) {
        return _balances[account];
    }

    function initBet(uint256 amount) public {

        require(lockedAmount == 0);
        require(_balances[msg.sender] >= amount);

        _balances[msg.sender] = _balances[msg.sender].sub(amount, "not enough balance");
        lockedAmount = amount;
    }

    function submitResult(int r) public returns (bool) {

        require(lockedAmount != 0);

        if ( r == 1 + 1) {
            _balances[msg.sender] = _balances[msg.sender].add(lockedAmount);
            lockedAmount = 0;
            return true;
        } else {
            return false;
        }
    }
}
